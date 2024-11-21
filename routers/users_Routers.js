const usersRouter = require("express").Router();
const { addNewUser } = require('../controllers/users_Controllers')

usersRouter.post('/users', addNewUser);

module.exports = { usersRouter }