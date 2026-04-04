import { UniqueEntityID } from '@core/entities/unique-entity-id.ts'
import { Description } from '@domain/entities/description.ts'
import { Name } from '@domain/entities/name.ts'
import { Project, type ProjectProps } from '@domain/entities/project.ts'
import { fakerPT_BR as faker } from '@faker-js/faker'

export function makeProject(
  override: Partial<ProjectProps> = {},
  id?: UniqueEntityID
): Project {
  const project = Project.create(
    {
      name: new Name(faker.person.fullName()),
      description: new Description(faker.lorem.sentence(2)),
      githubUrl: faker.internet.url(),
      type: 'fullstack',
      techs: [],
      userId: new UniqueEntityID('user-id'),
      ...override,
    },
    id
  )

  return project
}
