import { env } from '@config/env.ts'
import { BadGatewayError } from '@core/errors/bad-gateway-error.ts'
import type { ImageFile } from '@core/types/image.ts'
import type {
  StorageService,
  UploadResponse,
} from '@domain/application/services/storage-service.ts'
import { UTApi, UTFile } from 'uploadthing/server'

export class UploadthingStorageService implements StorageService {
  private readonly uploadthingApi: UTApi

  constructor() {
    this.uploadthingApi = new UTApi({
      token: env.UPLOADTHING_TOKEN,
    })
  }

  async upload(imageFile: ImageFile): Promise<UploadResponse> {
    const imageToUpload = new UTFile([imageFile.buffer], imageFile.name)

    const { data, error } = await this.uploadthingApi.uploadFiles(imageToUpload)

    if (error) {
      throw new BadGatewayError('Could not save image')
    }

    return {
      imageId: data.key,
      imageUrl: data.ufsUrl,
    }
  }

  async delete(imageId: string): Promise<void> {
    const { success } = await this.uploadthingApi.deleteFiles(imageId)

    if (!success) {
      throw new BadGatewayError('Could not save image')
    }
  }
}
