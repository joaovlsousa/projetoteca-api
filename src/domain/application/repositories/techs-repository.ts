import type { Tech } from '@domain/entities/tech.ts'

export interface TechsRespository {
  getAll(): Promise<Tech[]>
  getManyByIdList(techsIds: string[]): Promise<Tech[]>
  getOneByName(name: string): Promise<Tech | null>
  create(tech: Tech): Promise<void>
  delete(techId: string): Promise<void>
}
