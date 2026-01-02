import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { formatRepoName } from '@core/functions/format-repo-name.ts'
import { HashService } from '@core/services/hash-service.ts'
import type { UsersRespository } from '../../repositories/users-repository.ts'
import type { OAuthService } from '../../services/oauth-service.ts'

interface GetUserRepositoriesRequest {
  userId: string
}

interface GetUserRepositoriesResponse {
  repositories: {
    name: string
    slug: string
  }[]
}

export class GetUserRepositories {
  constructor(
    private usersRespository: UsersRespository,
    private oAuthService: OAuthService
  ) {}

  async execute({
    userId,
  }: GetUserRepositoriesRequest): Promise<GetUserRepositoriesResponse> {
    const user = await this.usersRespository.findById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    const githubAccessToken = await HashService.decode(
      user.githubHashedAccessToken
    )

    const { repositories: githubRepositories } =
      await this.oAuthService.getUserRepositories(githubAccessToken)

    const repositories = githubRepositories.map((repository) => {
      const name = formatRepoName(repository)

      return {
        slug: repository,
        name,
      }
    })

    return {
      repositories,
    }
  }
}
