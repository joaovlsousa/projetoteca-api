import { unlink, writeFile } from 'node:fs/promises'
import type { ImageFile } from '@core/types/image.ts'
import type {
  StorageService,
  UploadResponse,
} from '@domain/application/services/storage-service.ts'
import { createId } from '@paralleldrive/cuid2'

export class TestStorageService implements StorageService {
  private readonly pathToSavedImages: string = './temp'

  async upload(imageFile: ImageFile): Promise<UploadResponse> {
    const imageExtension = imageFile.mimetype.split('/')[1]
    const imageId = `${imageFile.name}-${createId()}.${imageExtension}`
    const imageUrl = `https://api/v1/images/${imageId}`

    await writeFile(`${this.pathToSavedImages}/${imageId}`, imageFile.buffer)

    return {
      imageId,
      imageUrl,
    }
  }

  async delete(imageId: string): Promise<void> {
    await unlink(`${this.pathToSavedImages}/${imageId}`)
  }
}
