export const MAX_LOGO_DIMENSION = (window.screen.availWidth / 2) * window.devicePixelRatio

/**
 * Resizes an image to fit within MAX_LOGO_DIMENSION while maintaining aspect ratio
 * @param file - The image file to resize
 * @returns The resized image as a Blob
 */
export async function clampImageSize(
  file: Blob,
  maxSize: number,
): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await loadImage(file)
  const dimensions = calculateDimensions(img, maxSize)

  if (dimensions.width === img.width && dimensions.height === img.height) {
    return { blob: file, width: dimensions.width, height: dimensions.height }
  }

  const blob = await resizeImage(img, dimensions.width, dimensions.height)
  return { blob, width: dimensions.width, height: dimensions.height }
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

function calculateDimensions(
  img: HTMLImageElement,
  maxSize: number,
): { width: number; height: number } {
  const { width, height } = img

  if (width <= maxSize && height <= maxSize) {
    return { width, height }
  }

  if (width > height) {
    return { width: maxSize, height: (height / width) * maxSize }
  }

  return { width: (width / height) * maxSize, height: maxSize }
}

function resizeImage(img: HTMLImageElement, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }

    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob from canvas'))
        }
      },
      'image/png',
      0.9,
    )
  })
}
