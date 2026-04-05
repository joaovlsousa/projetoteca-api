import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { formatRepoName } from '@core/functions/format-repo-name.ts'
import { HashService } from '@core/services/hash-service.ts'
import type { TechsRespository } from '../../repositories/techs-repository.ts'
import type { UsersRespository } from '../../repositories/users-repository.ts'
import type { OAuthService } from '../../services/oauth-service.ts'

interface GetRepositoryDataRequest {
  userId: string
  repositorySlug: string
}

interface GetRepositoryDataResponse {
  repository: {
    name: string
    description: string | null
    homepageUrl: string | null
    githubUrl: string
    techIds: string[]
  }
}

export class GetRepositoryData {
  constructor(
    private usersRespository: UsersRespository,
    private techsRespository: TechsRespository,
    private oAuthService: OAuthService
  ) {}

  async execute({
    userId,
    repositorySlug,
  }: GetRepositoryDataRequest): Promise<GetRepositoryDataResponse> {
    const user = await this.usersRespository.getById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    const githubAccessToken = await HashService.decode(
      user.githubAccessTokenHash
    )

    const { repository: githubRepository } =
      await this.oAuthService.getRepositoryData({
        accessToken: githubAccessToken,
        username: user.username,
        repository: repositorySlug,
      })

    const techs = await this.techsRespository.getManyByIdList([
      'GIT',
      githubRepository.language.toUpperCase(),
    ])

    const repositoryName = formatRepoName(repositorySlug)

    return {
      repository: {
        name: repositoryName,
        description: githubRepository.description,
        homepageUrl: githubRepository.homepageUrl,
        githubUrl: githubRepository.githubUrl,
        techIds: techs.map((tech) => tech.id.toString()),
      },
    }
  }
}
