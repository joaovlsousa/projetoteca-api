import type { Project } from '@domain/entities/project.ts'

export interface ProjectsRespository {
  countProjectsByUserId(userId: string): Promise<number>
  countStorageInBytesByUserId(userId: string): Promise<number>
  findByUserId(userId: string): Promise<Project[]>
  findById(projectId: string): Promise<Project | null>
  save(project: Project): Promise<void>
  create(project: Project): Promise<void>
  delete(projectId: string): Promise<void>
}
