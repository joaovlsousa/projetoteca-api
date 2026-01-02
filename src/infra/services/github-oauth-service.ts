import { GITHUB_API_URL, GITHUB_LOGIN_URL } from '@config/constants.ts'
import { env } from '@config/env.ts'
import { BadGatewayError } from '@core/errors/bad-gateway-error.ts'
import type {
  GetRepositoryDataRequest,
  GetRepositoryDataResponse,
  GetUserDataResponse,
  GetUserRepositoriesResponse,
  OAuthService,
} from '@domain/application/services/oauth-service.ts'
import { z } from 'zod'

export class GithubOAuthService implements OAuthService {
  async getAccessToken(code: string): Promise<string> {
    const githubOAuthURL = new URL(GITHUB_LOGIN_URL)

    githubOAuthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
    githubOAuthURL.searchParams.set(
      'client_secret',
      env.GITHUB_OAUTH_CLIENT_SECRET
    )
    githubOAuthURL.searchParams.set(
      'redirect_uri',
      env.GITHUB_OAUTH_CLIENT_REDIRECT_URI
    )
    githubOAuthURL.searchParams.set('code', code)
    githubOAuthURL.searchParams.set('scope', 'read:user public_repo')

    const githubAccessTokenResponse = await fetch(githubOAuthURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const githubAccessTokenData = await githubAccessTokenResponse.json()

    const { access_token: githubAccessToken } = z
      .object({
        access_token: z.string(),
        token_type: z.literal('bearer'),
        scope: z.string(),
      })
      .parse(githubAccessTokenData)

    return githubAccessToken
  }

  async getUserData(accessToken: string): Promise<GetUserDataResponse> {
    const githubUserResponse = await fetch(`${GITHUB_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    const githubUserData = await githubUserResponse.json()

    const {
      name,
      avatar_url: avatarUrl,
      id: githubId,
      login: username,
    } = z
      .object({
        avatar_url: z.url(),
        name: z.string().nullable(),
        id: z.number(),
        login: z.string(),
      })
      .parse(githubUserData)

    return {
      name: name ?? 'User',
      githubId,
      username,
      avatarUrl,
    }
  }

  async getUserRepositories(
    accessToken: string
  ): Promise<GetUserRepositoriesResponse> {
    const githubUserRepositoriesResponse = await fetch(
      `${GITHUB_API_URL}/user/repos`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    )

    if (!githubUserRepositoriesResponse.ok) {
      throw new BadGatewayError('Não foi possível buscar os repositórios')
    }

    const githubUserRepositories = await githubUserRepositoriesResponse.json()

    const repositories = z
      .array(
        z.object({
          name: z.string(),
        })
      )
      .parse(githubUserRepositories)

    return {
      repositories: repositories.map((repository) => repository.name),
    }
  }

  async getRepositoryData(
    params: GetRepositoryDataRequest
  ): Promise<GetRepositoryDataResponse> {
    const githubUserRepositoriesResponse = await fetch(
      `${GITHUB_API_URL}/repos/${params.username}/${params.repository}`,
      {
        headers: {
          Authorization: `Bearer ${params.accessToken}`,
          Accept: 'application/json',
        },
      }
    )

    if (!githubUserRepositoriesResponse.ok) {
      throw new BadGatewayError(
        'Não foi possível buscar os dados do repositório'
      )
    }

    const githubUserRepositories = await githubUserRepositoriesResponse.json()

    const {
      name,
      description,
      language,
      homepage: homepageUrl,
      html_url: githubUrl,
    } = z
      .object({
        name: z.string(),
        description: z.string().nullable(),
        homepage: z.httpUrl().nullable(),
        html_url: z.httpUrl(),
        language: z.string(),
      })
      .parse(githubUserRepositories)

    return {
      repository: {
        name,
        description,
        homepageUrl,
        githubUrl,
        language,
      },
    }
  }
}
