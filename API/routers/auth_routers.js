const authRouter = require("express").Router();

const { getAllMeals } = require('../controllers/meals_Controllers');
const { addNewUser} = require('../controllers/users_Controllers')

authRouter.get('/meals', getAllMeals);
authRouter.post('/users', addNewUser);

module.exports = { authRouter }