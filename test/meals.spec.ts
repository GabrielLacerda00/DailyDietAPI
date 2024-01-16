import { app } from '../src/app'
import { afterAll, beforeAll, it, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'
import { date, number } from 'zod'

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

  it('should be able to get all meals of a user', async () => {
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

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        userId,
        name: 'Arroz com brocolis',
        description: 'arroz com brocolis',
        is_on_diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        userId,
        name: 'Arroz Integral',
        description: 'arroz integral',
        is_on_diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        userId,
        name: 'Frango',
        description: 'desfiado',
        is_on_diet: true,
      })
      .expect(201)

    const meals = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    expect(meals.body.meals).toHaveLength(3)
  })

  it('should be able to get a specific meal of a user', async () => {
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

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        userId,
        name: 'Arroz com brocolis',
        description: 'arroz com brocolis',
        is_on_diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        userId,
        name: 'Frango',
        description: 'desfiado',
        is_on_diet: true,
      })
      .expect(201)

    const meals = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    expect(meals.body.meals).toHaveLength(2)

    const id = meals.body.meals[1].id

    const mealResponse = await request(app.server)
      .get(`/meals/${userId}/${id}`)
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    console.log()
    expect(mealResponse.body[0]).toEqual(
      expect.objectContaining({
        id,
        userId,
        name: 'Frango',
        description: 'desfiado',
        is_on_diet: 1,
        date: mealResponse.body[0].date,
        updated_at: mealResponse.body[0].date,
      }),
    )
  })

  // it('should be able to update a specific meal of a user', () => {})

  // it('should be able to delete a specific meal of a user', () => {})

  // it('should be able to get metrics of a user', () => {})
})
