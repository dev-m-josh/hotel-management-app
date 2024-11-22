const usersRouter = require("express").Router();
const { userLogin, editUser } = require('../controllers/users_Controllers')

usersRouter.post('/users/login', userLogin);
usersRouter.put('/users/:userId', editUser);
module.exports = { usersRouter }