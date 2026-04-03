import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { GetAllTechsUseCase } from '@domain/application/use-cases/techs/get-all-techs.ts'
import { DrizzleTechsRepository } from '@infra/database/drizzle/repositories/drizzle-techs-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getAllTechsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/techs',
    {
      schema: {
        summary: 'Get all techs',
        tags: ['Techs'],
        response: {
          200: z.object({
            techs: z.array(
              z.object({
                id: z.cuid2(),
                name: z.string(),
                imageUrl: z.httpUrl(),
              })
            ),
          }),
          403: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [],
    },
    async (_, reply) => {
      const getAllTechsUseCase = new GetAllTechsUseCase(
        new DrizzleTechsRepository()
      )

      const { techs } = await getAllTechsUseCase.execute()

      return reply.status(200).send({
        techs: techs.map((project) => ({
          id: project.id.toString(),
          name: project.name,
          imageUrl: project.imageUrl,
        })),
      })
    }
  )
}
