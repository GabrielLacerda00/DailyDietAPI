import 'dotenv/config' // Ler automaticamente meu arquivo env e joga em process.env
import { z } from 'zod'

// Schema de todas as variáveis ambientes
const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

// Tratamento dos dados com ZOD
// Trato os dados da variável process.env comparando com o schema criado
const tempEnv = envSchema.safeParse(process.env)
// Caso não condiza com o schema criado lanço um erro
if (tempEnv.success === false) {
  console.error('invalid variable enviroment', tempEnv.error.format())

  throw new Error('invalid variebles enviroment')
}

export const env = tempEnv.data
