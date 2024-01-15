// Aqui sobreescrevoa tipagem da minha bliblioteca KNEX
import { UUID } from 'crypto'
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    // Defino a tipagem das variveis do meu BD
    users: {
      id: string
      session_id?: string
      name: string
      email: string
      date: string
      updated_at: string
    }

    meals: {
      id: string
      userId: string
      name: string
      description: string
      is_on_diet: boolean
      date: string
      updated_at: string
    }
  }
}
