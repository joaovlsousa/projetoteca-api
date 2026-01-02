import {
  TOTAL_OF_PROJECTS_BY_USER,
  TOTAL_OF_STORAGE_BY_USER_IN_BYTES,
} from '@config/constants.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'

interface GetProjectsMetadataByUserIdUseCaseRequest {
  userId: string
}

interface GetProjectsMetadataByUserIdUseCaseResponse {
  metadata: {
    countProjects: number
    countStorageInBytes: number
    totalProjects: number
    totalStorageInBytes: number
  }
}

export class GetProjectsMetadataByUserIdUseCase {
  public constructor(private projectsRepository: ProjectsRespository) {}

  async execute({
    userId,
  }: GetProjectsMetadataByUserIdUseCaseRequest): Promise<GetProjectsMetadataByUserIdUseCaseResponse> {
    const { metadata } =
      await this.projectsRepository.getMetadataByUserId(userId)

    return {
      metadata: {
        ...metadata,
        totalProjects: TOTAL_OF_PROJECTS_BY_USER,
        totalStorageInBytes: TOTAL_OF_STORAGE_BY_USER_IN_BYTES,
      },
    }
  }
}
