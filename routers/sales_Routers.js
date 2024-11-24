const salesRouter = require("express").Router();

const { salesForEachOrder, salesForAllOrders } = require('../controllers/sales_Controllers');
salesRouter.get("/sales/orders", salesForEachOrder);
salesRouter.get("/sales", salesForAllOrders)

module.exports = { salesRouter };