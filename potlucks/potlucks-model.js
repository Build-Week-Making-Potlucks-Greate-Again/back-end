const db = require('../data/db-config');

module.exports = {
  add,
  find,
  findBy,
  findById,
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
