import type { Project } from '@domain/entities/project.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'

interface GetProjectsByUserIdUseCaseRequest {
  userId: string
}

interface GetProjectsByUserIdUseCaseResponse {
  projects: Project[]
}

export class GetProjectsByUserIdUseCase {
  public constructor(private projectsRepository: ProjectsRespository) {}

  async execute({
    userId,
  }: GetProjectsByUserIdUseCaseRequest): Promise<GetProjectsByUserIdUseCaseResponse> {
    const projects = await this.projectsRepository.getByUserId(userId)

    return {
      projects,
    }
  }
}
