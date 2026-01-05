import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import { fastifySwagger } from '@fastify/swagger'
import { errorHandler } from '@infra/http/errors/error-handler.ts'
import { authenticateWithGithubRoute } from '@infra/http/routes/authenticate-with-github.ts'
import { connectWithPortfolioRoute } from '@infra/http/routes/connect-with-portfolio.ts'
import { createProjectRoute } from '@infra/http/routes/create-project.ts'
import { deleteProjectRoute } from '@infra/http/routes/delete-project.ts'
import { findAllTechsRoute } from '@infra/http/routes/find-all-techs.ts'
import { findProjectByIdRoute } from '@infra/http/routes/find-project-by-id.ts'
import { findProjectsByUserIdRoute } from '@infra/http/routes/find-projects-by-user-id.ts'
import { findProjectsByUsernameRoute } from '@infra/http/routes/find-projects-by-username.ts'
import { getProfileRoute } from '@infra/http/routes/get-profile.ts'
import { getProjectsMetadataByUserIdRoute } from '@infra/http/routes/get-projects-metadata-by-user-id.ts'
import { getRepositoryDataRoute } from '@infra/http/routes/get-repository-data.ts'
import { getUserRepositoriesRoute } from '@infra/http/routes/get-user-repositories.ts'
import { updateProjectRoute } from '@infra/http/routes/update-project.ts'
import { updatePublicProfileRoute } from '@infra/http/routes/update-public-profile.ts'
import { uploadProjectImageRoute } from '@infra/http/routes/upload-project-image.ts'
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
server.register(updatePublicProfileRoute)
server.register(connectWithPortfolioRoute)

server.register(createProjectRoute)
server.register(updateProjectRoute)
server.register(findProjectsByUserIdRoute)
server.register(findProjectsByUsernameRoute)
server.register(findProjectByIdRoute)
server.register(getProjectsMetadataByUserIdRoute)
server.register(uploadProjectImageRoute)
server.register(deleteProjectRoute)

server.register(findAllTechsRoute)

server.register(getUserRepositoriesRoute)
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
