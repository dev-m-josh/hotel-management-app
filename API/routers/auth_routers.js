const authRouter = require("express").Router();

const { userLogin } = require('../controllers/users_Controllers')

authRouter.post('/login', userLogin);

module.exports = { authRouter }