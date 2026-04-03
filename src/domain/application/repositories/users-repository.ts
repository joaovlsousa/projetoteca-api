import type { User } from '@domain/entities/user.ts'

export interface UsersRespository {
  getByGithubId(githubId: number): Promise<User | null>
  getById(userId: string): Promise<User | null>
  getByUsername(username: string): Promise<User | null>
  create(user: User): Promise<void>
  save(user: User): Promise<void>
}
