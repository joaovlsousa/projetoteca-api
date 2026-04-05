import { Entity } from '@core/entities/entity.ts'
import type { UniqueEntityID } from '@core/entities/unique-entity-id.ts'
import type { Optional } from '@core/types/optional.ts'

export interface UserProps {
  name: string
  username: string
  githubId: number
  githubAccessTokenHash: string
  isPublicProfile: boolean
  apiKeyHash?: string | null
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

  public get githubAccessTokenHash(): string {
    return this.props.githubAccessTokenHash
  }

  public get isPublicProfile(): boolean {
    return this.props.isPublicProfile
  }

  public get apiKeyHash(): string | undefined | null {
    return this.props.apiKeyHash
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

  public set name(name: string) {
    this.props.name = name
  }

  public set githubAccessTokenHash(githubAccessTokenHash: string) {
    this.props.githubAccessTokenHash = githubAccessTokenHash
  }

  public set isPublicProfile(isPublicProfile: boolean) {
    this.props.isPublicProfile = isPublicProfile
  }

  public set apiKeyHash(apiKeyHash: string | null) {
    this.props.apiKeyHash = apiKeyHash
  }

  public set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }
}
