import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { UpdateProjectUseCase } from '@domain/application/use-cases/update-project.ts'
import { DrizzleProjectsRepository } from '@infra/database/drizzle/repositories/drizzle-projects-respository.ts'
import { DrizzleTechsRepository } from '@infra/database/drizzle/repositories/drizzle-techs-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

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
          techsIds: z.array(z.cuid2()),
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
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const { name, description, type, githubUrl, deployUrl, techsIds } =
        request.body
      const { projectId } = request.params
      const userId = request.getCurrentUserId()

      const updateProjectUseCase = new UpdateProjectUseCase(
        new DrizzleProjectsRepository(),
        new DrizzleTechsRepository()
      )

      await updateProjectUseCase.execute({
        projectId,
        userId,
        name,
        description,
        type,
        githubUrl,
        deployUrl,
        techsIds,
      })

      return reply.status(204).send()
    }
  )
}
