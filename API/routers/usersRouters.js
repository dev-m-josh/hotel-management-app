const usersRouter = require("express").Router();
const { editUserName, deleteUser, getAllStaffs } = require('../controllers/usersControllers')

usersRouter.get('/', getAllStaffs);
usersRouter.put('/:userId', editUserName);
usersRouter.delete('/:userId', deleteUser);
module.exports = { usersRouter }