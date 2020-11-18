const express = require('express');
const router = express.Router();

const db = require('../data/db-config');
const Potlucks = require('./potlucks-model');
const restricted = require('../auth/restricted-middleware');

//post a potluck, with guests and food items
router.post('/potluck', restricted, (req, res) => {
  const {
    potluck_name,
    date,
    time,
    location,
    potluck_organizer,
    guest_list,
    food_items,
  } = req.body;

  if (
    !potluck_name ||
    !date ||
    !time ||
    !location ||
    !potluck_organizer ||
    guest_list.length <= 0 ||
    food_items.length <= 0
  ) {
    res.status(400).json({ message: 'dont have all req info' });
  } else {
    const newPotluck = {
      potluck_name,
      date,
      time,
      location,
      potluck_organizer,
    };
    Potlucks.createPotluckWithGuestsAndFoodItems(
      newPotluck,
      guest_list,
      food_items
    )
      .then((potluck) => {
        res.status(201).json(potluck);
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Failed to create new potluck' });
        res.status(500).json({ message: err.message });
      });
  }
});

//get a specific potluck
router.get('/potluck/:id', restricted, (req, res) => {
  Potlucks.getAPotluck(req.params.id)
    .then((potluck) => {
      if (potluck) {
        res.status(200).json(potluck);
      } else {
        res.status(404).json({ message: 'no potluck for that id' });
        console.log(potluck);
      }
    })
    .catch((err) => res.json({ message: err.message }));
});

//get all potlucks
router.get('/potlucks', restricted, (req, res) => {
  Potlucks.getAllPotlucks()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.json({ message: err.message }));
});

//get all foods for a potluck (tester)
router.get('/potluck/foods/:id', restricted, (req, res) => {
  Potlucks.getallFoodsForAPotluck(req.params.id)
    .then((foods) => {
      res.status(200).json(foods);
    })
    .catch((err) => res.json({ message: err.message }));
});

module.exports = router;
