import type { TechsRespository } from '@domain/application/repositories/techs-repository.ts'
import type { Tech } from '@domain/entities/tech.ts'

export class InMemoryTechsRepository implements TechsRespository {
  public techs: Tech[] = []

  async create(tech: Tech): Promise<void> {
    this.techs = [tech, ...this.techs]
  }

  async getManyByIdList(techsIds: string[]): Promise<Tech[]> {
    const techs = this.techs.filter((tech) =>
      techsIds.includes(tech.id.toString())
    )

    return techs
  }

  async getAll(): Promise<Tech[]> {
    return this.techs
  }

  async getOneByName(name: string): Promise<Tech | null> {
    const tech = this.techs.find((tech) => tech.name === name)

    if (!tech) {
      return null
    }

    return tech
  }

  async delete(techId: string): Promise<void> {
    this.techs = this.techs.filter((tech) => tech.id.toString() !== techId)
  }
}
