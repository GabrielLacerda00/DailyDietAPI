import fastify from 'fastify'
import { knex } from './database'
import crypto from 'crypto'

const app = fastify()

app.get('/test', async () => {
  const test = await knex('meals')
    .insert({
      id: crypto.randomUUID(),
      userId: crypto.randomUUID(),
      name: 'Meal Test',
      description: 'arroz com carne',
      is_on_diet: true,
      date: new Date(),
    })
    .returning('*')

  return test
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running!!')
  })
