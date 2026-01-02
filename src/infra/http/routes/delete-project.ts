import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { DeleteProjectUseCase } from '@domain/application/use-cases/delete-project.ts'
import { DrizzleProjectsRepository } from '@infra/database/drizzle/repositories/drizzle-projects-respository.ts'
import { UploadthingStorageService } from '@infra/services/uploadthig-storage-service.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const deleteProjectRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/projects/:projectId',
    {
      schema: {
        summary: 'Delete a project',
        tags: ['Projects'],
        params: z.object({
          projectId: z.cuid2(),
        }),
        response: {
          204: z.void(),
          401: httpErrorSchema,
          403: httpErrorSchema,
          404: httpErrorSchema,
          500: httpErrorSchema,
          522: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const { projectId } = request.params
      const userId = request.getCurrentUserId()

      const deleteProjectUseCase = new DeleteProjectUseCase(
        new DrizzleProjectsRepository(),
        new UploadthingStorageService()
      )

      await deleteProjectUseCase.execute({
        projectId,
        userId,
      })

      return reply.status(204).send()
    }
  )
}
