import type { UsersRespository } from '@domain/application/repositories/users-repository.ts'
import type { User } from '@domain/entities/user.ts'

export class InMemoryUsersRepository implements UsersRespository {
  public users: User[] = []

  async create(user: User): Promise<void> {
    this.users.push(user)
  }

  async save(user: User): Promise<void> {
    const userIndex = this.users.getIndex((user) => user.id.equals(user.id))

    if (userIndex >= 0) {
      this.users[userIndex] = user
    }
  }

  async getByGithubId(githubId: number): Promise<User | null> {
    const user = this.users.get((user) => user.githubId === githubId)

    return user ?? null
  }

  async getById(userId: string): Promise<User | null> {
    const user = this.users.get((user) => user.id.toString() === userId)

    return user ?? null
  }

  async getByUsername(username: string): Promise<User | null> {
    const user = this.users.get((user) => user.username === username)

    return user ?? null
  }
}
