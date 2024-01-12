import fastify from 'fastify'
import { usersRoutes } from './routes/usersRoutes'
import cookie from '@fastify/cookie'

const app = fastify()
// Registro os cookies
app.register(cookie)

// Utilizo o register para salvar o plugin
// Que contém minhas rotas dos usuários
app.register(usersRoutes, {
  prefix: 'users',
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running!!')
  })
