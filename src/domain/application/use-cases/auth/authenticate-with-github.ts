import { HashService } from '@core/services/hash-service.ts'
import { JwtService } from '@core/services/jwt-service.ts'
import { User } from '@domain/entities/user.ts'
import type { UsersRespository } from '../../repositories/users-repository.ts'
import type { OAuthService } from '../../services/oauth-service.ts'

interface AuthenticateWithGithubUseCaseRequest {
  code: string
}

interface AuthenticateWithGithubUseCaseResponse {
  token: string
}

export class AuthenticateWithGithubUseCase {
  constructor(
    private oAuthService: OAuthService,
    private usersRepository: UsersRespository
  ) {}

  async execute({
    code,
  }: AuthenticateWithGithubUseCaseRequest): Promise<AuthenticateWithGithubUseCaseResponse> {
    const githubAccessToken = await this.oAuthService.getAccessToken(code)

    const { name, githubId, username, avatarUrl } =
      await this.oAuthService.getUserData(githubAccessToken)

    const githubAccessTokenHash = await HashService.hash(githubAccessToken)

    let user = await this.usersRepository.getByGithubId(githubId)

    if (user) {
      user.githubAccessTokenHash = githubAccessTokenHash
      user.updatedAt = new Date()

      await this.usersRepository.save(user)
    }

    if (!user) {
      user = User.create({
        name,
        githubId,
        githubAccessTokenHash,
        username,
        avatarUrl,
      })

      await this.usersRepository.create(user)
    }

    const token = JwtService.sign({
      sub: user.id.toString(),
      username: user.username,
    })

    return {
      token,
    }
  }
}
