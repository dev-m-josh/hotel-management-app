const usersRouter = require("express").Router();
const { userLogin, editUser, deleteUser } = require('../controllers/users_Controllers')

usersRouter.post('/users/login', userLogin);
usersRouter.put('/users/:userId', editUser);
usersRouter.delete('/users/:userId', deleteUser);
module.exports = { usersRouter }