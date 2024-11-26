const ordersRouter = require("express").Router();
const { getOrders, placeAnOrder } = require("../controllers/ordersControllers");

ordersRouter.get("/", getOrders);
ordersRouter.post("/", placeAnOrder)

module.exports = { ordersRouter }