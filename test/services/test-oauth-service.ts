import type {
  GetRepositoryDataRequest,
  GetRepositoryDataResponse,
  GetUserDataResponse,
  OAuthService,
} from '@domain/application/services/oauth-service.ts'
import { faker } from '@faker-js/faker'

export class TestOAuthService implements OAuthService {
  async getAccessToken(_code: string): Promise<string> {
    return faker.string.uuid()
  }

  async getUserData(_accessToken: string): Promise<GetUserDataResponse> {
    return {
      name: faker.person.fullName(),
      githubId: 1234,
      username: faker.internet.username(),
      avatarUrl: faker.image.avatarGitHub(),
    }
  }

  async getRepositoryData(
    _params: GetRepositoryDataRequest
  ): Promise<GetRepositoryDataResponse> {
    return {
      repository: {
        name: faker.lorem.slug(),
        description: faker.lorem.words(),
        homepageUrl: faker.internet.url(),
        githubUrl: faker.internet.url(),
        language: 'TypeScript',
      },
    }
  }
}
