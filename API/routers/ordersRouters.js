const ordersRouter = require("express").Router();
const { getOrders } = require("../controllers/ordersControllers");

ordersRouter.get("/", getOrders);

module.exports = { ordersRouter }