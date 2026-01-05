import { Entity } from '@core/entities/entity.ts'
import type { UniqueEntityID } from '@core/entities/unique-entity-id.ts'
import type { Optional } from '@core/types/optional.ts'

export interface UserProps {
  name: string
  username: string
  githubId: number
  githubHashedAccessToken: string
  isPublicProfile: boolean
  hashedPortfolioUrl?: string | null
  avatarUrl: string
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends Entity<UserProps> {
  public static create(
    props: Optional<UserProps, 'isPublicProfile' | 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const user = new User(
      {
        ...props,
        isPublicProfile: props.isPublicProfile ?? false,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return user
  }

  public get name(): string {
    return this.props.name
  }

  public get githubId(): number {
    return this.props.githubId
  }

  public get username(): string {
    return this.props.username
  }

  public get githubHashedAccessToken(): string {
    return this.props.githubHashedAccessToken
  }

  public get isPublicProfile(): boolean {
    return this.props.isPublicProfile
  }

  public get hashedPortfolioUrl(): string | undefined | null {
    return this.props.hashedPortfolioUrl
  }

  public get avatarUrl(): string {
    return this.props.avatarUrl
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date | undefined | null {
    return this.props.updatedAt
  }

  public set githubHashedAccessToken(githubHashedAccessToken: string) {
    this.props.githubHashedAccessToken = githubHashedAccessToken
  }

  public set isPublicProfile(isPublicProfile: boolean) {
    this.props.isPublicProfile = isPublicProfile
  }

  public set hashedPortfolioUrl(hashedPortfolioUrl: string | null) {
    this.props.hashedPortfolioUrl = hashedPortfolioUrl
  }

  public set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }
}
