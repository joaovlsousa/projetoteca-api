import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import { validateImage } from '@core/functions/validate-image.ts'
import type { ImageFile } from '@core/types/image.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'
import type { StorageService } from '../../services/storage-service.ts'

interface UploadProjectImageUseCaseRequest {
  image: ImageFile
  projectId: string
  userId: string
}

export class UploadProjectImageUseCase {
  public constructor(
    private projectsRepository: ProjectsRespository,
    private storageService: StorageService
  ) {}

  async execute({
    image,
    projectId,
    userId,
  }: UploadProjectImageUseCaseRequest): Promise<void> {
    validateImage(image)

    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      throw new NotFoundError('Projeto não encontrado')
    }

    if (project.userId.toString() !== userId) {
      throw new ForbiddenError()
    }

    if (project.imageId) {
      await this.storageService.delete(project.imageId)
    }

    const { imageId, imageUrl } = await this.storageService.upload(image)

    project.imageId = imageId
    project.imageUrl = imageUrl
    project.imageSizeInBytes = image.size
    project.updatedAt = new Date()

    await this.projectsRepository.save(project)
  }
}
