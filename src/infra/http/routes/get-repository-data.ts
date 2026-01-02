import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { GetRepositoryData } from '@domain/application/use-cases/repositories/get-repository-data.ts'
import { DrizzleTechsRepository } from '@infra/database/drizzle/repositories/drizzle-techs-respository.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import { GithubOAuthService } from '@infra/services/github-oauth-service.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const getRepositoryDataRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/repos/:slug',
    {
      schema: {
        summary: 'Get repository data',
        tags: ['Repositories'],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            repository: z.object({
              name: z.string(),
              description: z.string().nullable(),
              homepageUrl: z.httpUrl().nullable(),
              githubUrl: z.httpUrl(),
              techId: z.string().nullable(),
            }),
          }),
          401: httpErrorSchema,
          500: httpErrorSchema,
          522: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const userId = request.getCurrentUserId()
      const { slug } = request.params

      const getRepositoryData = new GetRepositoryData(
        new DrizzleUsersRepository(),
        new DrizzleTechsRepository(),
        new GithubOAuthService()
      )

      const { repository } = await getRepositoryData.execute({
        userId,
        repositorySlug: slug,
      })

      return reply.status(200).send({
        repository,
      })
    }
  )
}
