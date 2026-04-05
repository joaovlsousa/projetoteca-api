import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId: () => string
  }
}
