import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'
import type { StorageService } from '../../services/storage-service.ts'

interface DeleteProjectUseCaseRequest {
  userId: string
  projectId: string
}

export class DeleteProjectUseCase {
  public constructor(
    private projectsRepository: ProjectsRespository,
    private storageService: StorageService
  ) {}

  async execute({
    projectId,
    userId,
  }: DeleteProjectUseCaseRequest): Promise<void> {
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

    await this.projectsRepository.delete(projectId)
  }
}
