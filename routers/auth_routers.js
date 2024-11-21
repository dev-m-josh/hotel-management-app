const mealsRouter = require("express").Router();

const { getAllMeals } = require('../controllers/meals_Controllers');

mealsRouter.get('/meals', getAllMeals);

module.exports = { mealsRouter }