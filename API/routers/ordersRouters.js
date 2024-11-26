const ordersRouter = require("express").Router();
const { getOrders, placeAnOrder, deleteAnOrder } = require("../controllers/ordersControllers");

ordersRouter.get("/", getOrders);
ordersRouter.post("/", placeAnOrder);
ordersRouter.delete("/:orderId", deleteAnOrder);

module.exports = { ordersRouter }