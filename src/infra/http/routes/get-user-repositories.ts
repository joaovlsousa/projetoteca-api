import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { GetUserRepositories } from '@domain/application/use-cases/get-user-repositories.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import { GithubOAuthService } from '@infra/services/github-oauth-service.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const getUserRepositoriesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/repos',
    {
      schema: {
        summary: 'Get user repositories',
        tags: ['Repositories'],
        response: {
          200: z.object({
            repositories: z.array(
              z.object({
                name: z.string(),
                slug: z.string(),
              })
            ),
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

      const getUserRepositories = new GetUserRepositories(
        new DrizzleUsersRepository(),
        new GithubOAuthService()
      )

      const { repositories } = await getUserRepositories.execute({ userId })

      return reply.status(200).send({
        repositories,
      })
    }
  )
}
