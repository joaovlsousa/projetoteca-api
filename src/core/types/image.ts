export interface ImageFile {
  buffer: Buffer
  name: string
  mimetype: string
  size: number
}

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const IMAGE_MIMETYPES: string[] = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg',
]
