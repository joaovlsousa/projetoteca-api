import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { FindProjectsByUsernameUseCase } from '@domain/application/use-cases/projects/find-projects-by-username.ts'
import { DrizzleProjectsRepository } from '@infra/database/drizzle/repositories/drizzle-projects-respository.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { allowAllOriginMiddleware } from '../middlewares/allow-all-origin-middleware.ts'
import { verifyOriginMiddleware } from '../middlewares/verify-origin-middleware.ts'

export const findProjectsByUsernameRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    '/users/:username/projects',
    {
      schema: {
        summary: 'Get projects by username',
        tags: ['Projects'],
        params: z.object({
          username: z.string(),
        }),
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
          403: httpErrorSchema,
          404: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [allowAllOriginMiddleware, verifyOriginMiddleware],
    },
    async (request, reply) => {
      const hashedPortfolioUrl = await request.getPortfolioAccessToken()

      const { username } = request.params

      const findProjectsByUsernameUseCase = new FindProjectsByUsernameUseCase(
        new DrizzleUsersRepository(),
        new DrizzleProjectsRepository()
      )

      const { projects } = await findProjectsByUsernameUseCase.execute({
        username,
        hashedPortfolioUrl,
      })

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
