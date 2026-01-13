import type { ProjectsRespository } from '@domain/application/repositories/projects-repository.ts'
import type { Project } from '@domain/entities/project.ts'

export class InMemoryProjectsRepository implements ProjectsRespository {
  public projects: Project[] = []

  async create(project: Project): Promise<void> {
    this.projects = [project, ...this.projects]
  }

  async save(project: Project): Promise<void> {
    const projectIndex = this.projects.findIndex((project) =>
      project.id.equals(project.id)
    )

    if (projectIndex >= 0) {
      this.projects[projectIndex] = project
    }
  }

  async findByUserId(userId: string): Promise<Project[]> {
    const projects = this.projects.filter(
      (project) => project.userId.toString() === userId
    )

    return projects
  }

  async countProjectsByUserId(userId: string): Promise<number> {
    const projects = this.projects.filter(
      (project) => project.userId.toString() === userId
    )

    return projects.length
  }

  async countStorageInBytesByUserId(userId: string): Promise<number> {
    const projects = this.projects.filter(
      (project) => project.userId.toString() === userId
    )

    let countStorageInBytes: number = 0

    for (const project of projects) {
      countStorageInBytes += project.imageSizeInBytes ?? 0
    }

    return countStorageInBytes
  }

  async findById(projectId: string): Promise<Project | null> {
    const project = this.projects.find(
      (project) => project.id.toString() === projectId
    )

    return project ?? null
  }

  async delete(projectId: string): Promise<void> {
    this.projects = this.projects.filter(
      (project) => project.id.toString() !== projectId
    )
  }
}
