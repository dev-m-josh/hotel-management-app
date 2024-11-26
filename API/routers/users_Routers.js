const usersRouter = require("express").Router();
const { userLogin, editUser, deleteUser, getAllStaffs } = require('../controllers/users_Controllers')

usersRouter.get('/', getAllStaffs);
usersRouter.post('/login', userLogin);
usersRouter.put('/:userId', editUser);
usersRouter.delete('/:userId', deleteUser);
module.exports = { usersRouter }