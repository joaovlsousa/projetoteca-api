import type { User } from '@domain/entities/user.ts'

export interface UsersRespository {
  findByGithubId(githubId: number): Promise<User | null>
  findById(userId: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  create(user: User): Promise<void>
  save(user: User): Promise<void>
}
