const mealsRouter = require("express").Router();

const {addNewMeal, getTrendingMeals, getAvailableServings } = require('../controllers/meals_Controllers');

mealsRouter.post('/meals', addNewMeal);
mealsRouter.get('/available-servings-history', getAvailableServings)
mealsRouter.get('/trending-meal', getTrendingMeals)

module.exports = { mealsRouter }