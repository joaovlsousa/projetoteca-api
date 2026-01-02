export interface ImageFile {
  buffer: Buffer
  name: string
  mimetype: string
  size: number
}

export const MAX_IMAGE_SIZE = 1024 * 1024 // 1MB
export const IMAGE_MIMETYPES: string[] = ['image/png', 'image/webp']
