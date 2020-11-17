const db = require('../data/db-config');

module.exports = {
  add,
  find,
  findBy,
  findById,
  addAPotluck,
};

function find() {
  return db('potlucks').select('id', 'potluck_name').orderBy('id');
}

function findBy(filter) {
  return db('potlucks').where(filter).orderBy('id');
}

async function add(user) {
  try {
    const [id] = await db('potlucks').insert(user, 'id');

    return findById(id);
  } catch (error) {
    throw error;
  }
}

function findById(id) {
  return db('potlucks').where({ id }).first();
}

function addAPotluck(id) {
  return db('potlucks as p')
    .join('users as u', 'p.potluck_organizer as organzier_id', 'u.id')
    .join('food_items as f', 'f.potluck', 'p.id')
    .select(
      'u.username as user',
      'p.potluck_name',
      'p.date',
      'p.time',
      'p.location',
      'f.food_name'
    )
    .where({ 'p.id': id });
}
