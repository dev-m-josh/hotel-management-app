const ordersRouter = require("express").Router();
const { getOrders, placeAnOrder, deleteAnOrder, updateAnOrder } = require("../controllers/ordersControllers");

ordersRouter.get("/", getOrders);
ordersRouter.post("/", placeAnOrder);
ordersRouter.delete("/:orderId", deleteAnOrder);
ordersRouter.put("/:orderId", updateAnOrder)

module.exports = { ordersRouter }