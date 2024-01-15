// FastifyRequestContext
import 'fastify'

// Declaro um novo tipo para user
// Para poder salva o user da requisição
declare module 'fastify' {
  export interface FastifyRequest {
    user?: {
      id: string
      session_id?: string
      name: string
      email: string
      date: string
      updated_at: string
    }
  }
}
