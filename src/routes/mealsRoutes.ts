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
    // Pega todas as refeições de um user
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

  app.get(
    // Pega uma refeição de um user
    '/:userId/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      // defini o schema do meu params
      const paramsSchema = z.object({
        userId: z.string(),
        mealId: z.string(),
      })
      // verifico o userId e o mealId
      const { userId, mealId } = paramsSchema.parse(request.params)
      const meal = await knex('meals')
        .where({
          id: mealId,
          userId,
        })
        .select()

      return reply.send(meal)
    },
  )

  app.put(
    // Pega uma refeição de um user
    '/:userId/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      // defini o schema do meu params
      const paramsSchema = z.object({
        mealId: z.string().uuid(),
        userId: z.string(),
      })
      // verifico o userId e o mealId
      const { userId, mealId } = paramsSchema.parse(request.params)

      // defino o schema do meu update
      const updateBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        is_on_diet: z.boolean(),
      })

      // verifico o body do meu update
      // eslint-disable-next-line camelcase
      const { name, description, is_on_diet } = updateBodySchema.parse(
        request.body,
      )

      // Pego a meal
      const meal = await knex('meals')
        .where({
          id: mealId,
          userId,
        })
        .select()
        .first()

      // Verifico se a meal existe
      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals')
        .where({
          id: mealId,
          userId,
        })
        .update({
          name,
          description,
          // eslint-disable-next-line camelcase
          is_on_diet,
        })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:userId/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      // defini o schema do meu params
      const paramsSchema = z.object({
        userId: z.string(),
        mealId: z.string().uuid(),
      })
      // verifico o userId e o mealId
      const { userId, mealId } = paramsSchema.parse(request.params)
      const meal = await knex('meals')
        .where({
          id: mealId,
          userId,
        })
        .select()
        .first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals')
        .where({
          id: mealId,
          userId,
        })
        .delete()
      return reply.status(204).send()
    },
  )
}
