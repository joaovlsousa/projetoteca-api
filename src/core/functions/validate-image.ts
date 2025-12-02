import { BadRequestError } from '../errors/bad-request-error.ts'
import {
  IMAGE_MIMETYPES,
  type ImageFile,
  MAX_IMAGE_SIZE,
} from '../types/image.ts'

export function validateImage(image: ImageFile): void {
  if (image.size > MAX_IMAGE_SIZE) {
    throw new BadRequestError('Invalid image size')
  }

  if (!IMAGE_MIMETYPES.includes(image.mimetype)) {
    throw new BadRequestError('Invalid mimetype')
  }
}
