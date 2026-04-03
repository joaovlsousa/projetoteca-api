import type { Tech } from '@domain/entities/tech.ts'
import type { TechsRespository } from '../../repositories/techs-repository.ts'

interface GetAllTechsUseCaseResponse {
  techs: Tech[]
}

export class GetAllTechsUseCase {
  public constructor(private techsRepository: TechsRespository) {}

  async execute(): Promise<GetAllTechsUseCaseResponse> {
    const techs = await this.techsRepository.getAll()

    return {
      techs,
    }
  }
}
