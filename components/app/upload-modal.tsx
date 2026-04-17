"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, X, FileText, Check, AlertCircle, Loader2 } from "lucide-react";
import { ToastContainer, useToast } from "@/components/ui/premium-dialog";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
  tenantId: string;
}

type UploadStatus = "pending" | "uploading" | "processing" | "complete" | "error" | "cancelled";

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status: UploadStatus;
  progress: number;
  error?: string;
  sourceId?: string;
}

const ALLOWED_TYPES = [
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Spreadsheets
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // Presentations
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // Text files
  "text/plain",
  "text/markdown",
  "text/csv",
  "text/html",
  // Images (for OCR with Unstructured.io)
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/bmp",
  // Data formats
  "application/json",
  "application/xml",
  "text/xml",
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function UploadModal({ isOpen, onClose, onUploadComplete, tenantId }: UploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  
  // Refs to track active operations for cancellation
  const abortControllers = useRef<Map<string, AbortController>>(new Map());
  const pollingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const progressIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  // Clear files when modal opens (fresh start)
  useEffect(() => {
    if (isOpen) {
      setFiles([]);
    }
  }, [isOpen]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel all pending operations
      abortControllers.current.forEach((controller) => controller.abort());
      pollingTimeouts.current.forEach((timeout) => clearTimeout(timeout));
      progressIntervals.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      return "File type not supported. Please upload PDF, Word, Excel, PowerPoint, Text, Markdown, CSV, or Image files.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`;
    }
    return null;
  };

  // Calculate file hash for content-based duplicate detection
  const calculateFileHash = useCallback(async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }, []);

  // Check server for existing document with same hash
  const checkExistingDocument = useCallback(async (hash: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/knowledge-sources/check-hash?hash=${hash}`);
      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
    } catch {
      // API check failed, allow upload
    }
    return false;
  }, []);

  const addFiles = useCallback(async (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileList = Array.from(newFiles);
    const existingNames = new Set(files.map(f => f.name.toLowerCase()));
    const processedHashes = new Set<string>();
    const duplicates: string[] = [];
    const addedFiles: UploadFile[] = [];

    for (const file of fileList) {
      // Check 1: Exact filename duplicate
      if (existingNames.has(file.name.toLowerCase())) {
        duplicates.push(file.name);
        continue;
      }

      // Check 2: Content hash duplicate
      try {
        const hash = await calculateFileHash(file);
        
        // Check against files being added in this batch
        if (processedHashes.has(hash)) {
          duplicates.push(`${file.name} (same content)`);
          continue;
        }
        
        // Check against server (existing knowledge sources)
        const existsOnServer = await checkExistingDocument(hash);
        if (existsOnServer) {
          duplicates.push(`${file.name} (already exists in knowledge base)`);
          continue;
        }
        
        processedHashes.add(hash);
      } catch {
        // Hash calculation failed, continue with upload
      }

      const error = validateFile(file);
      addedFiles.push({
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        size: file.size,
        status: error ? "error" : "pending",
        progress: 0,
        error: error || undefined,
      });
      existingNames.add(file.name.toLowerCase());
    }

    // Show warning toast for duplicates
    if (duplicates.length > 0) {
      addToast({
        type: 'warning',
        title: duplicates.length === 1 ? 'Duplicate file skipped' : `${duplicates.length} duplicate files skipped`,
        message: duplicates.join(', '),
        duration: 5000,
      });
    }

    if (addedFiles.length > 0) {
      setFiles(prev => [...prev, ...addedFiles]);
    }
  }, [files, addToast, calculateFileHash, checkExistingDocument]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeFile = (id: string) => {
    // Cancel any ongoing operations for this file
    const controller = abortControllers.current.get(id);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(id);
    }
    
    const timeout = pollingTimeouts.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      pollingTimeouts.current.delete(id);
    }
    
    const interval = progressIntervals.current.get(id);
    if (interval) {
      clearInterval(interval);
      progressIntervals.current.delete(id);
    }
    
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFile = async (uploadFile: UploadFile) => {
    if (uploadFile.status === "error" || uploadFile.status === "cancelled") return;

    setFiles((prev) =>
      prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading", progress: 0 } : f))
    );

    // Create abort controller for this upload
    const controller = new AbortController();
    abortControllers.current.set(uploadFile.id, controller);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile.file);
      formData.append("tenantId", tenantId);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles((prev) => {
          const file = prev.find((f) => f.id === uploadFile.id);
          if (!file || file.status === "cancelled") {
            clearInterval(progressInterval);
            return prev;
          }
          return prev.map((f) =>
            f.id === uploadFile.id && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          );
        });
      }, 200);
      progressIntervals.current.set(uploadFile.id, progressInterval);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearInterval(progressInterval);
      progressIntervals.current.delete(uploadFile.id);

      if (controller.signal.aborted) {
        throw new Error("Upload cancelled");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle duplicate content (409 Conflict)
        if (response.status === 409 && errorData.existingSourceName) {
          addToast({
            type: 'warning',
            title: 'Duplicate file detected',
            message: `This file has already been uploaded as "${errorData.existingSourceName}"`,
            duration: 5000,
          });
          
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id
                ? { ...f, status: "error", error: `Duplicate: ${errorData.existingSourceName}` }
                : f
            )
          );
          return;
        }
        
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      // Update to processing state
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "processing", progress: 100, sourceId: result.sourceId }
            : f
        )
      );

      // Poll for processing completion
      pollProcessingStatus(uploadFile.id, result.sourceId);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Upload was cancelled, remove from list
        removeFile(uploadFile.id);
        return;
      }
      
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
    } finally {
      abortControllers.current.delete(uploadFile.id);
    }
  };

  const pollProcessingStatus = async (fileId: string, sourceId: string) => {
    const maxAttempts = 60; // 2 minutes (2s intervals)
    let attempts = 0;

    const checkStatus = async () => {
      // Check if file was cancelled/removed
      const currentFiles = files;
      const fileExists = currentFiles.find((f) => f.id === fileId);
      if (!fileExists || fileExists.status === "cancelled") {
        return; // Stop polling
      }

      try {
        const response = await fetch(`/api/knowledge-sources/${sourceId}/status`);
        if (response.ok) {
          const data = await response.json();
          
          if (data.status === "indexed") {
            setFiles((prev) =>
              prev.map((f) => (f.id === fileId ? { ...f, status: "complete" } : f))
            );
            pollingTimeouts.current.delete(fileId);
            return;
          } else if (data.status === "error") {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId
                  ? { ...f, status: "error", error: data.errorMessage || "Processing failed" }
                  : f
              )
            );
            pollingTimeouts.current.delete(fileId);
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          const timeout = setTimeout(checkStatus, 2000);
          pollingTimeouts.current.set(fileId, timeout);
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, status: "error", error: "Processing timeout" }
                : f
            )
          );
          pollingTimeouts.current.delete(fileId);
        }
      } catch {
        attempts++;
        if (attempts < maxAttempts) {
          const timeout = setTimeout(checkStatus, 2000);
          pollingTimeouts.current.set(fileId, timeout);
        } else {
          pollingTimeouts.current.delete(fileId);
        }
      }
    };

    // Start polling
    const initialTimeout = setTimeout(checkStatus, 2000);
    pollingTimeouts.current.set(fileId, initialTimeout);
  };

  const handleUploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    
    // Upload files sequentially to avoid overwhelming the server
    for (const file of pendingFiles) {
      await uploadFile(file);
    }

    // Notify parent that uploads are complete
    const completedCount = files.filter((f) => f.status === "complete").length;
    if (completedCount > 0) {
      onUploadComplete();
    }
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case "complete":
        return <Check className="h-5 w-5 text-emerald-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "uploading":
      case "processing":
        return <Loader2 className="h-5 w-5 text-violet-500 animate-spin" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: UploadStatus) => {
    switch (status) {
      case "complete":
        return "Indexed";
      case "error":
        return "Failed";
      case "uploading":
        return "Uploading...";
      case "processing":
        return "Processing...";
      default:
        return "Pending";
    }
  };

  if (!isOpen) return null;

  const hasPendingFiles = files.some((f) => f.status === "pending");
  const hasProcessingFiles = files.some((f) => f.status === "uploading" || f.status === "processing");
  const allComplete = files.length > 0 && files.every((f) => f.status === "complete" || f.status === "error");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upload Documents
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drop Zone */}
        <div className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Supports PDF, DOCX, XLSX, PPTX, TXT, MD, CSV, HTML, JPEG, PNG, TIFF, BMP, JSON, XML (up to 100MB each)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.md,.csv,.jpg,.jpeg,.png,.tiff,.html,.json,.xml"
              onChange={(e) => addFiles(e.target.files)}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              Select Files
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3 max-h-64 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    file.status === "error"
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                      : file.status === "complete"
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50"
                  }`}
                >
                  {getStatusIcon(file.status)}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span
                        className={`text-xs ${
                          file.status === "error"
                            ? "text-red-600 dark:text-red-400"
                            : file.status === "complete"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-violet-600 dark:text-violet-400"
                        }`}
                      >
                        {file.error || getStatusText(file.status)}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    {(file.status === "uploading" || file.status === "processing") && (
                      <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeFile(file.id)}
                    title={file.status === "uploading" || file.status === "processing" ? "Cancel upload" : "Remove file"}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {files.length === 0 ? (
              "No files selected"
            ) : (
              <>
                {files.filter((f) => f.status === "complete").length} of {files.length} complete
                {files.filter((f) => f.status === "error").length > 0 && (
                  <span className="text-red-500 ml-2">
                    ({files.filter((f) => f.status === "error").length} failed)
                  </span>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {allComplete && (
              <button
                onClick={() => {
                  setFiles([]);
                  onClose();
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Done
              </button>
            )}
            
            <button
              onClick={handleUploadAll}
              disabled={!hasPendingFiles || hasProcessingFiles}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {hasProcessingFiles ? "Uploading..." : "Upload All"}
            </button>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  );
}
