import type { TechsRespository } from '@domain/application/repositories/techs-repository.ts'
import type { Tech } from '@domain/enterprise/entities/tech.ts'

export class InMemoryTechsRepository implements TechsRespository {
  public techs: Tech[] = []

  async create(tech: Tech): Promise<void> {
    this.techs = [tech, ...this.techs]
  }

  async findAll(): Promise<Tech[]> {
    return this.techs
  }

  async delete(techId: string): Promise<void> {
    this.techs = this.techs.filter((tech) => tech.id.toString() !== techId)
  }
}
