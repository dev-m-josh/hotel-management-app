const ordersRouter = require("express").Router();
const { getOrders, placeAnOrder, deleteAnOrder, updateAnOrder, getOrderItems } = require("../controllers/ordersControllers");

ordersRouter.get("/", getOrders);
ordersRouter.post("/", placeAnOrder);
ordersRouter.delete("/:orderId", deleteAnOrder);
ordersRouter.put("/:orderId", updateAnOrder);
ordersRouter.get("/order-items", getOrderItems);

module.exports = { ordersRouter }