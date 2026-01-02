import type { Tech } from '@domain/entities/tech.ts'
import type { TechsRespository } from '../../repositories/techs-repository.ts'

interface FindAllTechsUseCaseResponse {
  techs: Tech[]
}

export class FindAllTechsUseCase {
  public constructor(private techsRepository: TechsRespository) {}

  async execute(): Promise<FindAllTechsUseCaseResponse> {
    const techs = await this.techsRepository.findAll()

    return {
      techs,
    }
  }
}
