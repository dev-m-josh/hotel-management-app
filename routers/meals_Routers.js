const mealsRouter = require("express").Router();

const {addNewMeal, getTrendingMeals } = require('../controllers/meals_Controllers');

mealsRouter.post('/meals', addNewMeal);
mealsRouter.get('/trending-meal', getTrendingMeals)

module.exports = { mealsRouter }