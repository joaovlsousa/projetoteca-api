import { IMAGE_MIMETYPES, MAX_IMAGE_SIZE_IN_BYTES } from '@core/constants.ts'
import { PayloadTooLargeError } from '@core/errors/payload-too-large-error.ts'
import { BadRequestError } from '../errors/bad-request-error.ts'
import type { ImageFile } from '../types/image.ts'

export function validateImage(image: ImageFile): void {
  if (image.size > MAX_IMAGE_SIZE_IN_BYTES) {
    const oneMegabyte = 1024 * 1024
    const maxImageSizeInMegabytes = MAX_IMAGE_SIZE_IN_BYTES / oneMegabyte

    throw new PayloadTooLargeError(
      `O tamanho da imagem é maior que ${maxImageSizeInMegabytes}MB.`
    )
  }

  if (!IMAGE_MIMETYPES.includes(image.mimetype)) {
    throw new BadRequestError(
      `Não é permitido imagens do tipo ${image.mimetype}.`
    )
  }
}
