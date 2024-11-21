const joi = require('joi');
//NEW MEAL
const newMealSchema = joi.object({
    name: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required()
})


 //CREATING A NEW USER
 const newUserSchema = joi.object({
    username: joi.string().required(),
    user_email: joi.string().email().required(),
    user_password: joi.string().min(8).max(64).required(),
    user_role: joi.string().required()
});

//USER LOGIN SCHEMA
const userLoginSchema = joi.object({
    user_email: joi.string().email().required(),
    user_password: joi.string().min(8).max(64).required(),
    user_role: joi.string().required()
})

module.exports = { newMealSchema, newUserSchema, userLoginSchema }