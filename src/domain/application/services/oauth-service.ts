export interface GetUserDataResponse {
  name: string
  githubId: number
  username: string
  avatarUrl: string
}

export interface GetRepositoryDataRequest {
  accessToken: string
  username: string
  repository: string
}

export interface GetRepositoryDataResponse {
  repository: {
    name: string
    description: string | null
    homepageUrl: string | null
    githubUrl: string
    language: string
  }
}

export interface OAuthService {
  getAccessToken(code: string): Promise<string>
  getUserData(accessToken: string): Promise<GetUserDataResponse>
  getRepositoryData(
    params: GetRepositoryDataRequest
  ): Promise<GetRepositoryDataResponse>
}
