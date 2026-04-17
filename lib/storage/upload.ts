import { writeFile, unlink } from "fs/promises";
import { mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

interface UploadParams {
  id: string;
  buffer: Buffer;
  filename: string;
  contentType: string;
}

export async function uploadToStorage({
  id,
  buffer,
  filename,
}: UploadParams): Promise<string> {
  // Development: Store in local filesystem
  // Production: Upload to S3 or similar

  const uploadDir = join(process.cwd(), "uploads", id.slice(0, 2));
  await mkdir(uploadDir, { recursive: true });

  const filePath = join(uploadDir, `${id}-${filename}`);
  await writeFile(filePath, buffer);

  return filePath;
}

interface DeleteParams {
  id: string;
  filename: string;
}

export async function deleteFromStorage({
  id,
  filename,
}: DeleteParams): Promise<boolean> {
  try {
    const uploadDir = join(process.cwd(), "uploads", id.slice(0, 2));
    const filePath = join(uploadDir, `${id}-${filename}`);

    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log(`✓ Deleted file from storage: ${filePath}`);
      return true;
    }

    // Try to find file with different extension if exact match not found
    const fs = await import("fs/promises");
    const files = await fs.readdir(uploadDir).catch(() => []);
    const matchingFile = files.find((f) => f.startsWith(`${id}-`));

    if (matchingFile) {
      const fullPath = join(uploadDir, matchingFile);
      await unlink(fullPath);
      console.log(`✓ Deleted file from storage: ${fullPath}`);
      return true;
    }

    console.warn(`⚠ File not found for deletion: ${filePath}`);
    return false;
  } catch (error) {
    console.error(`✗ Failed to delete file from storage:`, error);
    return false;
  }
}
