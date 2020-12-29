const db = require('../data/db-config');

module.exports = {
  createPotluckWithGuestsAndFoodItems,
  getAPotluck,
  getAllPotlucks,
  getallFoodsForAPotluck,
  updatePotluckWithGuestsAndFoodItems,
};
//-----------------------------------------------------------
//ADDING A POTLUCK:

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
  return { newPotluck, foodItems, guestList };
}

//----------------------------------------------------------------
//GETTING A SPECIFIC POTLUCK WITH ID PARAM

//this gets all foods that pertain to a specific potluck
async function getallFoodsForAPotluck(id) {
  return db('food_items as f')
    .select('f.food_name', 'f.selected?', 'f.selected_by')
    .where({ 'f.potluck': id });
}

// this gets all users that pertain to a specific potluck
async function getAllGuestsForAPotluck(id) {
  return db('potluck_guests as pg')
    .join('users as u', 'pg.guest_id', 'u.id')
    .select('u.username')
    .where({ 'pg.potluck_id': id });
}
//this gets a potluck with all foods and guests that pertain to it
async function getAPotluck(id) {
  const potluckInfo = await db('potlucks as p')
    .join('users as u', 'p.potluck_organizer', 'u.id')
    .select(
      'u.username as organizer',
      'p.potluck_name',
      'p.id',
      'p.date',
      'p.time',
      'p.location'
    )
    .where({ 'p.id': id });
  const foodInfo = await getallFoodsForAPotluck(id);
  const guestsInfo = await getAllGuestsForAPotluck(id);

  return { potluckInfo, foodInfo, guestsInfo };
}

//------------------------------------------------------------------
//GETTING ALL OF THE POTLUCKS

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], array[index].id);
  }
}

// Iterates over collection
// Return void
const startAsyncOperation = async (collection, dbCallBack, table) => {
  await asyncForEach(collection, async (potluck) => {
    if (table === 'potluck_guests') {
      potluck.guestList = await dbCallBack(potluck.id);
    } else if (table === 'food_items') {
      potluck.foodList = await dbCallBack(potluck.id);
    }
  });
  console.log('Done');
};

// this gets all of the polucks in the db
async function getAllPotlucks() {
  let allPotlucks = await db('potlucks as p')
    .join('users as u', 'p.potluck_organizer', 'u.id')
    .select(
      'u.username as organizer',
      'p.potluck_name',
      'p.id',
      'p.date',
      'p.time',
      'p.location'
    )
    .orderBy('p.id');
  //iterate over all potlucks appending food items and guestsList to eack potluck
  await startAsyncOperation(allPotlucks, getallFoodsForAPotluck, 'food_items');
  await startAsyncOperation(
    allPotlucks,
    getAllGuestsForAPotluck,
    'potluck_guests'
  );

  return { allPotlucks };
}

//---------------------------------------------------------------------
//UPDATE A GIVEN POTLUCK WITH ID
// will need to check for duplicate rows, so no guests can be added to potluck twice
// use .where({guest_id:guest, potluck_id:potluckId})


/// We Will need a function to check for any deleted guests for the update///


function updateGuestList(guestList, potluckId) {
  
  guestList.forEach( async (guest) => {
    try {
      const guestExists = await db('potluck_guests').where({guest_id:guest, potluck_id:potluckId})
      if(!guestExists[0]) {
        db('potluck_guests').insert({
          guest_id: guest,
          potluck_id: potluckId,
        });
      } else {
        console.log(`guest is already in potluck`)
      }
    } catch(err) {
      console.log(err.message)
    }
  });
}
//this associates all of my food items with one potluck
// updates the foodlist if it was selected, and who selected it
async function updateFoodList(foodList, potluckId) {
  foodList.forEach((food) => {
    const {food_name, selected_by} = food
    db('food_items').where({food_name:food_name, potluck:potluckId}).update({
      ['selected?']:food['selected?'],
      selected_by:selected_by
    })
  });
}

//this adds a potluck and adds users, foods to their own tables
async function updatePotluckWithGuestsAndFoodItems(
  id,
  updatedPotluck,
  guestList,
  foodItems
) {
  await db('potlucks').update(updatedPotluck);
  //now that we have a potluck we can associate any number of food items in this potluck by creating food id, potluck id associations
  updateFoodList(foodItems, id);
  //now that we have a potluck we can associate any number of guest ids in this potluck by creating guest id, potluck id associations
  updateGuestList(guestList, id);
  return { updatedPotluck, foodItems, guestList };
}

//-------------------------------------

// function find() {
//   return db('potlucks').select('id', 'potluck_name').orderBy('id');
// }

// function findBy(filter) {
//   return db('potlucks').where(filter).orderBy('id');
// }

// function findById(id) {
//   return db('potlucks').where({ id }).first();
// }
