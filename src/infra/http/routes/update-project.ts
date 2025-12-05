import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { UpdateProjectUseCase } from '@domain/application/use-cases/update-project.ts'
import { DrizzleProjectsRepository } from '@infra/database/drizzle/repositories/drizzle-projects-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'
import { clientHostMiddleware } from '../middlewares/client-host-middleware.ts'

export const updateProjectRoute: FastifyPluginAsyncZod = async (app) => {
  app.put(
    '/projects/:projectId',
    {
      schema: {
        summary: 'Update a project',
        tags: ['Projects'],
        params: z.object({
          projectId: z.cuid2(),
        }),
        body: z.object({
          name: z.string(),
          description: z.string(),
          type: z.union([
            z.literal('frontend'),
            z.literal('backend'),
            z.literal('fullstack'),
          ]),
          githubUrl: z.httpUrl(),
          deployUrl: z.httpUrl().optional(),
        }),
        response: {
          204: z.void(),
          400: httpErrorSchema,
          401: httpErrorSchema,
          403: httpErrorSchema,
          404: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware, clientHostMiddleware],
    },
    async (request, reply) => {
      const { name, description, type, githubUrl, deployUrl } = request.body
      const { projectId } = request.params
      const userId = request.getCurrentUserId()

      const updateProjectUseCase = new UpdateProjectUseCase(
        new DrizzleProjectsRepository()
      )

      await updateProjectUseCase.execute({
        projectId,
        userId,
        name,
        description,
        type,
        githubUrl,
        deployUrl,
      })

      return reply.status(204).send()
    }
  )
}
