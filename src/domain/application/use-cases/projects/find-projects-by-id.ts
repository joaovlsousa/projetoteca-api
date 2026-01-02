import type { Project } from '@domain/entities/project.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'

interface FindProjectsByIdUseCaseRequest {
  projectId: string
}

interface FindProjectsByIdUseCaseResponse {
  project: Project | null
}

export class FindProjectsByIdUseCase {
  public constructor(private projectsRepository: ProjectsRespository) {}

  async execute({
    projectId,
  }: FindProjectsByIdUseCaseRequest): Promise<FindProjectsByIdUseCaseResponse> {
    const project = await this.projectsRepository.findById(projectId)

    return {
      project,
    }
  }
}
