import { table } from 'console'
import type { Knex } from 'knex'

// Método que define o que minha migration vai fazer
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('session_id').notNullable().unique()
    table.text('name').notNullable()
    table.text('email').notNullable().unique()
    table.date('date').notNullable()
    table.timestamps(true, true)
  })
}

// Desfaz o que o método up fez - rollback
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
