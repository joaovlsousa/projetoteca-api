import { UniqueEntityID } from '@core/entities/unique-entity-id.ts'
import { Tech, type TechProps } from '@domain/enterprise/entities/tech.ts'
import { fakerPT_BR as faker } from '@faker-js/faker'

export function makeTech(
  override: Partial<TechProps> = {},
  id?: UniqueEntityID
): Tech {
  const tech = Tech.create(
    {
      name: faker.person.middleName(),
      imageUrl: faker.image.avatar(),
      imageId: new UniqueEntityID().toString(),
      ...override,
    },
    id
  )

  return tech
}
