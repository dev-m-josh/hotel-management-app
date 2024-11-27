const ordersRouter = require("express").Router();
const {
  getOrders,
  placeAnOrder,
  deleteAnOrder,
  updateAnOrder,
  getOrderItems,
  selectOrderItems,
  editOrderItems,
} = require("../controllers/ordersControllers");

ordersRouter.get("/", getOrders);
ordersRouter.post("/", placeAnOrder);
ordersRouter.delete("/:orderId", deleteAnOrder);
ordersRouter.put("/:orderId", updateAnOrder);
ordersRouter.get("/order-items", getOrderItems);
ordersRouter.post("/order-items", selectOrderItems);
ordersRouter.put("/order-items/:itemId", editOrderItems);

module.exports = { ordersRouter };
