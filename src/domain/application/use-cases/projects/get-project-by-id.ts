import type { Project } from '@domain/entities/project.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'

interface GetProjectByIdUseCaseRequest {
  projectId: string
}

interface GetProjectByIdUseCaseResponse {
  project: Project | null
}

export class GetProjectByIdUseCase {
  public constructor(private projectsRepository: ProjectsRespository) {}

  async execute({
    projectId,
  }: GetProjectByIdUseCaseRequest): Promise<GetProjectByIdUseCaseResponse> {
    const project = await this.projectsRepository.getById(projectId)

    return {
      project,
    }
  }
}
