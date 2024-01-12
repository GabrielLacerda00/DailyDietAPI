import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'

// Cookies <-> manter contexto entre requisições
export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    // O que define um user?
    // {id, nome, email}
    const userSchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    // Verifico se já existe o sessionId na minha requisição
    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 20, // 20 days
      })
    }

    // Valido os dados que recebi do body da requisição
    const { name, email } = userSchema.parse(request.body)

    const userByEmail = await knex('users').where({ email }).first()

    if (userByEmail) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    // Insiro o usuário no BD
    await knex('users').insert({
      id: randomUUID(),
      session_id: sessionId,
      name,
      email,
    })

    return reply.status(201).send()
  })

  app.get('/', async (request, reply) => {
    const { sessionId } = request.cookies
    const transactions = await knex('users')
      .where('session_id', sessionId)
      .select()
    return { transactions }
  })
}
