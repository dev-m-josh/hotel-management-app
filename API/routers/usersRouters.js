const usersRouter = require("express").Router();
const { editUserName, deleteUser, getAllStaffs, editUserRole } = require('../controllers/usersControllers')

usersRouter.get('/', getAllStaffs);
usersRouter.put('/:userId', editUserName);
usersRouter.put('/role/:userId', editUserRole);
usersRouter.delete('/:userId', deleteUser);
module.exports = { usersRouter }