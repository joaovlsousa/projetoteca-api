import type { Project } from '@domain/entities/project.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'

interface FindProjectsByUserIdUseCaseRequest {
  userId: string
}

interface FindProjectsByUserIdUseCaseResponse {
  projects: Project[]
}

export class FindProjectsByUserIdUseCase {
  public constructor(private projectsRepository: ProjectsRespository) {}

  async execute({
    userId,
  }: FindProjectsByUserIdUseCaseRequest): Promise<FindProjectsByUserIdUseCaseResponse> {
    const projects = await this.projectsRepository.findByUserId(userId)

    return {
      projects,
    }
  }
}
