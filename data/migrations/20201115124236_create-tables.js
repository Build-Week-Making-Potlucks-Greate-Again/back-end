exports.up = function (knex) {
  return knex.schema
    .createTable('users', (tbl) => {
      tbl.increments();
      tbl.string('email', 128).notNullable().unique();
      tbl.string('first_name', 128).notNullable();
      tbl.string('last_name', 128).notNullable();
      tbl.string('username', 128).notNullable().unique().index();
      tbl.string('password', 128).notNullable();
    })

    .createTable('potlucks', (tbl) => {
      tbl.increments();
      tbl.string('potluck_name', 128).notNullable();
      tbl.date('date').notNullable();
      tbl.time('time').notNullable();
      tbl.string('location').notNullable();
      tbl
        .integer('potluck_organizer')
        .unsigned()
        .references('users.id')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
    })

    .createTable('potluck_guests', (tbl) => {
      tbl.increments();
      tbl
        .integer('guest_id')
        .unsigned()
        .references('users.id')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
      tbl
        .integer('potluck_id')
        .unsigned()
        .references('potlucks.id')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
    })

    .createTable('food_items', (tbl) => {
      tbl.increments();
      tbl.string('food_name').notNullable();
      tbl.boolean('selected?').defaultTo(0);
      tbl
        .integer('selected_by')
        .unsigned()
        .references('users.id')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
      tbl
        .integer('potluck')
        .unsigned()
        .references('potlucks.id')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('food_items')
    .dropTableIfExists('potluck_guests')
    .dropTableIfExists('potlucks')
    .dropTableIfExists('users');
};
