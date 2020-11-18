const db = require('../data/db-config');

module.exports = {
  createPotluckWithGuestsAndFoodItems,
  find,
  findBy,
  findById,
  getAPotluck,
  getAllPotlucks,
  getallFoodsForAPotluck,
};

//this associates all of my guests with one potluck
async function createGuestList(guestList, potluckId) {
  await db('potluck_guests').insert(
    guestList.map((guest) => {
      return {
        guest_id: guest,
        potluck_id: potluckId,
      };
    })
  );
}

//this associates all of my food items with one potluck
async function createFoodList(foodItems, potluckId) {
  await db('food_items').insert(
    foodItems.map((food) => {
      // console.log(food);
      return {
        food_name: food,

        potluck: potluckId,
      };
    })
  );
}

//this adds a potluck and adds users, foods to their own tables
async function createPotluckWithGuestsAndFoodItems(
  newPotluck,
  guestList,
  foodItems
) {
  const [id] = await db('potlucks').insert(newPotluck);
  //now that we have a potluck we can associate any number of food items in this potluck by creating food id, potluck id associations
  createFoodList(foodItems, id);
  //now that we have a potluck we can associate any number of guest ids in this potluck by creating guest id, potluck id associations
  createGuestList(guestList, id);
  return newPotluck;
}

function find() {
  return db('potlucks').select('id', 'potluck_name').orderBy('id');
}

function findBy(filter) {
  return db('potlucks').where(filter).orderBy('id');
}

function findById(id) {
  return db('potlucks').where({ id }).first();
}

//this gets all foods that pertain to a specific potluck
function getallFoodsForAPotluck(id) {
  return (
    db('food_items as f')
      .join('potlucks as p, f.potluck, p.id')
      // .select('f.food_name')
      .where({ 'f.potluck': id })
  );
}

//this gets a potluck with all foods that pertain to it
async function getAPotluck(id) {
  const potluckInfo = await db('potlucks as p')
    .join('users as u', 'p.potluck_organizer', 'u.id')
    // .join('food_items as f', 'f.potluck', 'p.id')
    // .join('potluck_guests as pg', 'pg.potluck_id', 'p.id')
    .select(
      'u.username as organizer',
      'p.potluck_name',
      'p.id',
      'p.date',
      'p.time',
      'p.location'
      // 'f.food_name',
      // 'pg.guest_id'
    )
    .where({ 'p.id': id });
  const foodInfo = await getallFoodsForAPotluck(id);
  console.log('food info:', foodInfo);
  console.log('potluck info:', potluckInfo);
  return { potluckInfo, foodInfo };
}

//this gets all of the polucks in the db
function getAllPotlucks() {
  return db('potlucks as p')
    .join('users as u', 'p.potluck_organizer', 'u.id')
    .join('food_items as f', 'f.potluck', 'p.id')
    .join('potluck_guests as pg', 'pg.potluck_id', 'p.id')
    .select(
      'u.username as organizer',
      'p.id',
      'p.potluck_name',
      'p.date',
      'p.time',
      'p.location',
      'f.food_name',
      'pg.guest_id'
    );
}
