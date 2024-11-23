const usersRouter = require("express").Router();
const { userLogin, editUser, deleteUser, getAllStaffs } = require('../controllers/users_Controllers')

usersRouter.get('/users', getAllStaffs);
usersRouter.post('/users/login', userLogin);
usersRouter.put('/users/:userId', editUser);
usersRouter.delete('/users/:userId', deleteUser);
module.exports = { usersRouter }