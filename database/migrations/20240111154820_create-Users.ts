import type { Knex } from 'knex'

// Método que define o que minha migration vai fazer
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('session_id').notNullable()
    table.text('name').notNullable()
    table.text('email').notNullable().unique()
    table.timestamp('date').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })
}

// Desfaz o que o método up fez - rollback
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
