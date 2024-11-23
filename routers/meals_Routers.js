const mealsRouter = require("express").Router();

const {
  addNewMeal,
  getTrendingMeals,
  getAvailableServings,
  addAvailableServings,
} = require("../controllers/meals_Controllers");

mealsRouter.post("/meals", addNewMeal);
mealsRouter.get("/available-servings-history", getAvailableServings);
mealsRouter.get("/trending-meal", getTrendingMeals);
mealsRouter.post("/available-servings-history", addAvailableServings);

module.exports = { mealsRouter };
