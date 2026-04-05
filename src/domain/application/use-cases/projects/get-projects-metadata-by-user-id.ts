import { MAX_NUMBER_OF_PROJECTS_BY_USER } from '@core/constants.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'

interface GetProjectsMetadataByUserIdUseCaseRequest {
  userId: string
}

interface GetProjectsMetadataByUserIdUseCaseResponse {
  metadata: {
    countProjects: number
    totalOfProjectsByUser: number
  }
}

export class GetProjectsMetadataByUserIdUseCase {
  public constructor(private projectsRepository: ProjectsRespository) {}

  async execute({
    userId,
  }: GetProjectsMetadataByUserIdUseCaseRequest): Promise<GetProjectsMetadataByUserIdUseCaseResponse> {
    const countProjects =
      await this.projectsRepository.countProjectsByUserId(userId)

    return {
      metadata: {
        countProjects,
        totalOfProjectsByUser: MAX_NUMBER_OF_PROJECTS_BY_USER,
      },
    }
  }
}
