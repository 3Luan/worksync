/**
 * Extracts filename from Content-Disposition header.
 * Falls back to default name if not found.
 * @param contentDisposition - The Content-Disposition header value.
 * @param fallback - Default filename to use if none is found.
 */
export const getFileName = (contentDisposition?: string, fallback = 'download.file'): string => {
  if (!contentDisposition) return fallback;

  const match = contentDisposition.match(/filename[^;=\n]*=(['"]?)([^'"\n]*)\1?/);
  return match && match[2] ? decodeURIComponent(match[2]) : fallback;
};

/**
 * Triggers a download from a Blob object or BlobPart.
 * @param data - The Blob or BlobPart to download.
 * @param filename - The name of the file to save.
 */
export const triggerDownload = (data: Blob | BlobPart, filename: string) => {
  const blob = data instanceof Blob ? data : new Blob([data]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

/**
 * Download file from blob part with content disposition header.
 * @param blobData - The BlobPart (usually from API response).
 * @param contentDisposition - Optional content-disposition header to extract filename.
 * @param fallbackName - Optional fallback filename.
 */
export const downloadFileFromBlob = (
  blobData: BlobPart,
  contentDisposition?: string,
  fallbackName = 'default.zip',
) => {
  const filename = getFileName(contentDisposition, fallbackName);
  triggerDownload(blobData, filename);
};
