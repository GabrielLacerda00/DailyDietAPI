import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const mealsSchema = z.object({
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
    })

    // eslint-disable-next-line camelcase
    const { name, description, is_on_diet } = mealsSchema.parse(request.body)

    await knex('meals').insert({
      id: randomUUID(),
      userId: request.user?.id,
      name,
      description,
      // eslint-disable-next-line camelcase
      is_on_diet,
    })
    return reply.status(201).send()
  })

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({ userId: request.user?.id })
        .select()
      return reply.send({ meals })
    },
  )
}
