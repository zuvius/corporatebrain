"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";

interface VerificationBannerProps {
  email: string;
}

export function VerificationBanner({ email }: VerificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Don't show if user dismissed it this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem("verificationBannerDismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("verificationBannerDismissed", "true");
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend");
      }

      setMessage("Verification email sent! Check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend email");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <span className="font-semibold">Verify your email</span> to unlock full access. 
                We sent a verification link to{" "}
                <span className="font-medium">{email}</span>
              </p>
              
              {message && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  {message}
                </div>
              )}
              
              {error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="mt-2 flex items-center gap-4">
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200 underline underline-offset-2 disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Resend email"}
                </button>
                <span className="text-yellow-600 dark:text-yellow-400">|</span>
                <button
                  onClick={handleDismiss}
                  className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
