import fastify from 'fastify'
import { knex } from './database'
import crypto from 'crypto'

const app = fastify()

app.get('/test', async () => {
  const test = await knex('users')
    .insert({
      id: crypto.randomUUID(),
      session_id: '12345678910',
      name: 'User Test',
      email: 'gabtes@gmail.com',
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
