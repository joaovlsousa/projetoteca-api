import { MAX_STORAGE_LIMIT_IN_BYTES_BY_USER } from '@core/constants.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'

interface GetStorageMetadataByUserIdUseCaseRequest {
  userId: string
}

interface GetStorageMetadataByUserIdUseCaseResponse {
  metadata: {
    countStorageInBytes: number
    totalOfStorageInBytesByUser: number
  }
}

export class GetStorageMetadataByUserIdUseCase {
  public constructor(private projectsRepository: ProjectsRespository) {}

  async execute({
    userId,
  }: GetStorageMetadataByUserIdUseCaseRequest): Promise<GetStorageMetadataByUserIdUseCaseResponse> {
    const countStorageInBytes =
      await this.projectsRepository.countStorageInBytesByUserId(userId)

    return {
      metadata: {
        countStorageInBytes,
        totalOfStorageInBytesByUser: MAX_STORAGE_LIMIT_IN_BYTES_BY_USER,
      },
    }
  }
}
