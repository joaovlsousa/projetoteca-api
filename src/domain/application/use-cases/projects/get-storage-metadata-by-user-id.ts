import { TOTAL_OF_STORAGE_BY_USER_IN_BYTES } from '@config/constants.ts'
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
        totalOfStorageInBytesByUser: TOTAL_OF_STORAGE_BY_USER_IN_BYTES,
      },
    }
  }
}
