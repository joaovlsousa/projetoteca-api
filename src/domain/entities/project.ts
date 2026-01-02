import { Entity } from '@core/entities/entity.ts'
import type { UniqueEntityID } from '@core/entities/unique-entity-id.ts'
import type { Optional } from '@core/types/optional.ts'
import type { ProjectType } from '@core/types/project-type.ts'
import type { Description } from './description.ts'
import type { Name } from './name.ts'
import type { Tech } from './tech.ts'

export interface ProjectProps {
  name: Name
  description: Description
  type: ProjectType
  userId: UniqueEntityID
  techs: Tech[]
  imageUrl?: string | null
  imageId?: string | null
  imageSizeInBytes?: number | null
  githubUrl: string
  deployUrl?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Project extends Entity<ProjectProps> {
  public static create(
    props: Optional<ProjectProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const project = new Project(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return project
  }

  public get name(): Name {
    return this.props.name
  }

  public get description(): Description {
    return this.props.description
  }

  public get type(): ProjectType {
    return this.props.type
  }

  public get userId(): UniqueEntityID {
    return this.props.userId
  }

  public get techs(): Tech[] {
    return this.props.techs
  }

  public get imageUrl(): string | undefined | null {
    return this.props.imageUrl
  }

  public get imageId(): string | undefined | null {
    return this.props.imageId
  }

  public get imageSizeInBytes(): number | undefined | null {
    return this.props.imageSizeInBytes
  }

  public get githubUrl(): string {
    return this.props.githubUrl
  }

  public get deployUrl(): string | undefined | null {
    return this.props.deployUrl
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date | undefined | null {
    return this.props.updatedAt
  }

  public set name(name: Name) {
    this.props.name = name
  }

  public set description(description: Description) {
    this.props.description = description
  }

  public set type(type: ProjectType) {
    this.props.type = type
  }

  public set techs(techs: Tech[]) {
    this.props.techs = techs
  }

  public set githubUrl(githubUrl: string) {
    this.props.githubUrl = githubUrl
  }

  public set deployUrl(deployUrl: string | undefined | null) {
    this.props.deployUrl = deployUrl
  }

  public set imageId(imageId: string | undefined | null) {
    this.props.imageId = imageId
  }

  public set imageUrl(imageUrl: string | undefined | null) {
    this.props.imageUrl = imageUrl
  }

  public set imageSizeInBytes(imageSizeInBytes: number | undefined | null) {
    this.props.imageSizeInBytes = imageSizeInBytes
  }

  public set updatedAt(date: Date) {
    this.props.updatedAt = date
  }
}
