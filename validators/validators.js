const joi = require('joi');

 //CREATING A NEW USER
 const newUserSchema = joi.object({
    username: joi.string().required(),
    user_email: joi.string().email().required(),
    user_password: joi.string().min(8).max(64).required(),
    user_role: joi.string().required()
});

module.exports = { newUserSchema }