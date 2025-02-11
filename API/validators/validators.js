const joi = require("joi");
//NEW MEAL
const newMealSchema = joi.object({
  name: joi.string().required(),
  category: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().required(),
});

//CREATING A NEW USER
const newUserSchema = joi.object({
  username: joi.string().required(),
  user_email: joi.string().email().required(),
  user_password: joi.string().min(8).max(64).required(),
  user_role: joi.string().required(),
});

//USER ROLE UPDATE SCHEMA
const editUserRoleSchema = joi.object({
  user_role: joi.string()
      .valid('admin', 'waiter', 'manager')
      .required()
});

//USER EDIT SCHEMA
const editUsernameSchema = joi.object({
  username: joi.string().min(3).max(255).required()
});

//USER LOGIN SCHEMA
const userLoginSchema = joi.object({
  user_email: joi.string().email().required(),
  user_password: joi.string().min(8).max(64).required(),
});

//AVAILABLE SERVINGS SCHEMA
const availableServingsSchema = joi.object({
  meal_id: joi.number().required(),
  available_servings: joi.number().required(),
});

// Define the schema for a single order item
const orderItemSchema = joi.object({
  order_id: joi.number().required(),
  meal_id: joi.number().required(),
  quantity: joi.number().positive().integer().required(),
});

// Define the schema for an array of order items
const orderItemsSchema = joi.array().items(orderItemSchema).required();

//ORDER SCHEMA
const orderSchema = joi.object({
  waiter_id: joi.number().required(),
  order_status: joi.string().valid("pending", "served").required(),
  table_number: joi.number().required(),
});

//ORDER ITEMS EDIT SCHEMA
const orderEditSchema = joi.object({
  meal_id: joi.number().required(),
  quantity: joi.number().positive().integer().required(),
});

// Define the schema for an array of order items
const orderEditsSchema = joi.array().items(orderEditSchema).required();

//ORDER STATUS SCHEMA
const orderStatusSchema = joi.object({
  order_status: joi.string().required(),
});

module.exports = {
  newMealSchema,
  newUserSchema,
  userLoginSchema,
  availableServingsSchema,
  orderItemsSchema,
  orderSchema,
  orderEditsSchema,
  orderStatusSchema,
  editUserRoleSchema,
  editUsernameSchema
};
