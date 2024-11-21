const mealsRouter = require("express").Router();

const {addNewMeal } = require('../controllers/meals_Controllers');

mealsRouter.post('/meals', addNewMeal);

module.exports = { mealsRouter }