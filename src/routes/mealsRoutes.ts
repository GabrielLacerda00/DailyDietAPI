import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const mealsSchema = z.object({
      userId: z.string(),
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
    })

    // eslint-disable-next-line camelcase
    const { userId, name, description, is_on_diet } = mealsSchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      userId,
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
        // .where({ userId: request.user?.id })
        .select()
      return reply.send({ meals })
    },
  )

  app.get(
    '/:userId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      // defini o schema do meu params
      const paramsSchema = z.object({
        userId: z.string(),
      })
      // verifico o id
      const { userId } = paramsSchema.parse(request.params)
      const meals = await knex('meals').where({ userId }).select()

      return reply.send(meals)
    },
  )
}
