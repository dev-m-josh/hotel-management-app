const salesRouter = require("express").Router();

const { salesForEachOrder, salesForAllOrders, salesForToday, previousdaySales } = require('../controllers/sales_Controllers');
salesRouter.get("/sales/orders", salesForEachOrder);
salesRouter.get("/sales", salesForAllOrders);
salesRouter.get("/sales/today", salesForToday);
salesRouter.get("/sales/previous", previousdaySales)

module.exports = { salesRouter };