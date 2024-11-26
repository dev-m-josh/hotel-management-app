const freeRouter = require("express").Router();
const { getAllMeals } = require('../controllers/meals_Controllers');
const { addNewUser} = require('../controllers/users_Controllers');

freeRouter.get('/meals', getAllMeals);
freeRouter.post('/users', addNewUser);

module.exports = { freeRouter }