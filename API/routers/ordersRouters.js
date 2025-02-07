const ordersRouter = require("express").Router();
const {
  getOrders,
  placeAnOrder,
  deleteAnOrder,
  updateAnOrder,
  getOrderItems,
  selectOrderItems,
  editOrderItems,
  deleteOrderItem,
  getPendingOrders,
} = require("../controllers/ordersControllers");

ordersRouter.get("/", getOrders); //served orders
ordersRouter.get("/pending-orders", getPendingOrders); //pending
ordersRouter.post("/", placeAnOrder); //create new order
ordersRouter.delete("/:orderId", deleteAnOrder); // delete order
ordersRouter.put("/:orderId", updateAnOrder); //update order status
ordersRouter.get("/order-items/:orderId", getOrderItems); //order items
ordersRouter.post("/order-items", selectOrderItems); //add items
ordersRouter.put("/order-items/:itemId", editOrderItems); //edit items
ordersRouter.delete("/order-items/:itemId", deleteOrderItem); //delete item

module.exports = { ordersRouter };
