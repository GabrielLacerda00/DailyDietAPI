import { app } from '../src/app'
import { afterAll, beforeAll, it, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'

describe('meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    // Crio o user
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'john@gmail.com' })
      .expect(201)
    // Pego o user
    const usersResponse = await request(app.server)
      .get('/users')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    expect(usersResponse.body.transactions).toHaveLength(1)
    // Pego o id do user
    const userId = usersResponse.body.transactions[0].id

    const response = await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        userId,
        name: 'Arroz com brocolis',
        description: 'arroz com brocolis',
        is_on_diet: true,
      })
      .expect(201)
  })

  // it('should be able to get all meals of a user', () => {})

  // it('should be able to get a specific meal of a user', () => {})

  // it('should be able to get a specific meal of a user', () => {})

  // it('should be able to update a specific meal of a user', () => {})

  // it('should be able to delete a specific meal of a user', () => {})

  // it('should be able to get metrics of a user', () => {})
})
