const usersRouter = require("express").Router();
const { userLogin } = require('../controllers/users_Controllers')

usersRouter.post('/users/login', userLogin)

module.exports = { usersRouter }