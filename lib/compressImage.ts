export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let width = img.naturalWidth
      let height = img.naturalHeight

      const ratio = Math.min(
        maxWidth / width,
        maxHeight / height,
        1
      )

      width = Math.round(width * ratio)
      height = Math.round(height * ratio)

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not create canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Image compression failed"))
            return
          }

          const fileName =
            file.name.replace(/\.[^/.]+$/, "") + ".webp"

          const compressedFile = new File(
            [blob],
            fileName,
            {
              type: "image/webp",
              lastModified: Date.now(),
            }
          )

          resolve(compressedFile)
        },
        "image/webp",
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("Could not load image"))
    }

    img.src = objectUrl
  })
}