import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { FindProjectsByUserIdUseCase } from '@domain/application/use-cases/find-projects-by-user-id.ts'
import { DrizzleProjectsRepository } from '@infra/database/drizzle/repositories/drizzle-projects-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const findProjectsByUserIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/projects',
    {
      schema: {
        summary: 'Get projects by user id',
        tags: ['Projects'],
        response: {
          200: z.object({
            projects: z.array(
              z.object({
                id: z.cuid2(),
                name: z.string(),
                description: z.string(),
                type: z.union([
                  z.literal('frontend'),
                  z.literal('backend'),
                  z.literal('fullstack'),
                ]),
                techs: z.array(
                  z.object({
                    id: z.cuid2(),
                    name: z.string(),
                    imageUrl: z.httpUrl().nullable(),
                  })
                ),
                imageUrl: z.httpUrl().nullable(),
                githubUrl: z.httpUrl(),
                deployUrl: z.httpUrl().nullable(),
                createdAt: z.date(),
                updatedAt: z.date().nullable(),
              })
            ),
          }),
          401: httpErrorSchema,
          403: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const userId = request.getCurrentUserId()

      const findProjectsByUserIdUseCase = new FindProjectsByUserIdUseCase(
        new DrizzleProjectsRepository()
      )

      const { projects } = await findProjectsByUserIdUseCase.execute({ userId })

      return reply.status(200).send({
        projects: projects.map((project) => ({
          id: project.id.toString(),
          name: project.name.toString(),
          description: project.description.toString(),
          type: project.type,
          techs: project.techs.map((tech) => ({
            id: tech.id.toString(),
            name: tech.name,
            imageUrl: tech.imageUrl,
          })),
          imageUrl: project.imageUrl ?? null,
          githubUrl: project.githubUrl,
          deployUrl: project.deployUrl ?? null,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt ?? null,
        })),
      })
    }
  )
}
