/**
 * Format bytes into readable string (KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculate size reduction percentage
 */
export function calculateSavings(original: number, compressed: number): { percent: number; text: string } {
  if (!original || original <= 0 || !compressed) return { percent: 0, text: '0%' };
  const diff = original - compressed;
  const percent = Math.round((diff / original) * 100);
  if (percent > 0) {
    return { percent, text: `-${percent}%` };
  } else if (percent < 0) {
    return { percent, text: `+${Math.abs(percent)}%` };
  }
  return { percent: 0, text: '0%' };
}

/**
 * Sanitize output filename
 */
export function getOutputFilename(originalName: string, suffix: string, targetExt?: string): string {
  const lastDot = originalName.lastIndexOf('.');
  const nameWithoutExt = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;
  const ext = targetExt ? targetExt.replace('.', '') : lastDot !== -1 ? originalName.substring(lastDot + 1) : '';
  
  return `${nameWithoutExt}_${suffix}${ext ? '.' + ext : ''}`;
}

/**
 * Parse page range string like "1-3, 5, 7-10" into array of 1-based page numbers
 */
export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  if (!rangeStr.trim()) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  const parts = rangeStr.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
          pages.add(i);
        }
      }
    } else {
      const pageNum = parseInt(trimmed, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        pages.add(pageNum);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
