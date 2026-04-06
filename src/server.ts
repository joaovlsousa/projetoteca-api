import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import { fastifySwagger } from '@fastify/swagger'
import { errorHandler } from '@infra/http/errors/error-handler.ts'
import { authenticateWithGithubRoute } from '@infra/http/routes/auth/authenticate-with-github.ts'
import { createProjectRoute } from '@infra/http/routes/projects/create-project.ts'
import { deleteProjectRoute } from '@infra/http/routes/projects/delete-project.ts'
import { getProjectByIdRoute } from '@infra/http/routes/projects/get-project-by-id.ts'
import { getProjectsByUserIdRoute } from '@infra/http/routes/projects/get-projects-by-user-id.ts'
import { getProjectsMetadataByUserIdRoute } from '@infra/http/routes/projects/get-projects-metadata-by-user-id.ts'
import { getPublicProjectsRoute } from '@infra/http/routes/projects/get-public-projects.ts'
import { getStorageMetadataByUserIdRoute } from '@infra/http/routes/projects/get-storage-metadata-by-user-id.ts'
import { updateProjectRoute } from '@infra/http/routes/projects/update-project.ts'
import { uploadProjectImageRoute } from '@infra/http/routes/projects/upload-project-image.ts'
import { getRepositoryDataRoute } from '@infra/http/routes/repositories/get-repository-data.ts'
import { getAllTechsRoute } from '@infra/http/routes/techs/get-all-techs.ts'
import { deleteApiKeyRoute } from '@infra/http/routes/users/delete-api-key.ts'
import { generateApiKeyRoute } from '@infra/http/routes/users/generate-api-key.ts'
import { getApiKeyRoute } from '@infra/http/routes/users/get-api-key.ts'
import { getProfileRoute } from '@infra/http/routes/users/get-profile.ts'
import { getProfileStatusRoute } from '@infra/http/routes/users/get-profile-status.ts'
import { updateProfileNameRoute } from '@infra/http/routes/users/update-profile-name.ts'
import { updateProfileStatusRoute } from '@infra/http/routes/users/update-profile-status.ts'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './config/env.ts'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setErrorHandler(errorHandler)
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(fastifyCors, {
  origin: env.CLIENT_APP_URL,
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
})
server.register(fastifyMultipart)
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Projetoteca API',
      description: 'API para organização de projetos de software.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

if (env.NODE_ENV !== 'production') {
  server.register(ScalarApiReference, {
    routePrefix: '/docs',
  })
}

server.register(authenticateWithGithubRoute)
server.register(getProfileRoute)
server.register(updateProfileNameRoute)
server.register(getProfileStatusRoute)
server.register(updateProfileStatusRoute)
server.register(generateApiKeyRoute)
server.register(getApiKeyRoute)
server.register(deleteApiKeyRoute)

server.register(createProjectRoute)
server.register(updateProjectRoute)
server.register(getProjectsByUserIdRoute)
server.register(getPublicProjectsRoute)
server.register(getProjectByIdRoute)
server.register(getProjectsMetadataByUserIdRoute)
server.register(getStorageMetadataByUserIdRoute)
server.register(uploadProjectImageRoute)
server.register(deleteProjectRoute)

server.register(getAllTechsRoute)

server.register(getRepositoryDataRoute)

server
  .listen({
    port: env.PORT,
    host: env.HOST,
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${env.PORT}`)
    console.log(`Docs available at http://localhost:${env.PORT}/docs`)
  })
