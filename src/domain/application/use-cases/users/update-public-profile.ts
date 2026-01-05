import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import type { UsersRespository } from '../../repositories/users-repository.ts'

interface UpdatePublicProfileUseCaseRequest {
  userId: string
  isPublicProfile: boolean
}

export class UpdatePublicProfileUseCase {
  public constructor(private usersRepository: UsersRespository) {}

  async execute({
    userId,
    isPublicProfile,
  }: UpdatePublicProfileUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    user.isPublicProfile = isPublicProfile

    await this.usersRepository.save(user)
  }
}
