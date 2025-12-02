import { UniqueEntityID } from '@core/entities/unique-entity-id.ts'
import { Tech } from '@domain/enterprise/entities/tech.ts'
import type { techsTable } from '../schema.ts'

type RawTech = typeof techsTable.$inferSelect

export class DrizzleTechsMapper {
  static toDrizzle(tech: Tech): RawTech {
    return {
      id: tech.id.toString(),
      name: tech.name.toString(),
      imageId: tech.imageId,
      imageUrl: tech.imageUrl,
      createdAt: tech.createdAt,
      updatedAt: tech.updatedAt ?? null,
    }
  }

  static toDomain(raw: RawTech): Tech {
    return Tech.create(
      {
        name: raw.name,
        imageId: raw.imageId,
        imageUrl: raw.imageUrl,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }
}
