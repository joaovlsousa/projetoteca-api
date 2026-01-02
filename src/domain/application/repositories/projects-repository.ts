import type { Project } from '@domain/entities/project.ts'

export interface GetMetadataByUserIdResponse {
  metadata: {
    countProjects: number
    countStorageInBytes: number
  }
}

export interface ProjectsRespository {
  getMetadataByUserId(userId: string): Promise<GetMetadataByUserIdResponse>
  findByUserId(userId: string): Promise<Project[]>
  findById(projectId: string): Promise<Project | null>
  save(project: Project): Promise<void>
  create(project: Project): Promise<void>
  delete(projectId: string): Promise<void>
}
