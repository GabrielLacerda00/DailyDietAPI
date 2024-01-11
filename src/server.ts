import fastify from 'fastify'

const app = fastify()

app.get('/test', () => {
  return 'works'
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running!!')
  })
