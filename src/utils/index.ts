import { saveAs } from 'file-saver'

/**
 * Format file size
 * @param size
 */
export const formatSize = (size?: number) => {
  if (!size) return 'Unknown'
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}


/**
 * Download image
 * @param url image url
 * @param fileName filename to save as
 */
export function downloadImage(url?: string, fileName?: string) {
  if (!url) {
    return
  }
  saveAs(url, fileName)
}
