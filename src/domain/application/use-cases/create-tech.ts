import { validateImage } from '@core/functions/validate-image.ts'
import type { ImageFile } from '@core/types/image.ts'
import { Tech } from '@domain/enterprise/entities/tech.ts'
import type { TechsRespository } from '../repositories/techs-repository.ts'
import type { StorageService } from '../services/storage-service.ts'

interface CreateTechRequest {
  image: ImageFile
  name: string
}

export class CreateTechUseCase {
  public constructor(
    private techsRepository: TechsRespository,
    private storageService: StorageService
  ) {}

  async execute({ image, name }: CreateTechRequest): Promise<void> {
    validateImage(image)

    const { imageId, imageUrl } = await this.storageService.upload(image)

    const tech = Tech.create({
      name,
      imageId,
      imageUrl,
    })

    await this.techsRepository.create(tech)
  }
}
