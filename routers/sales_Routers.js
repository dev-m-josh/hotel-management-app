const salesRouter = require("express").Router();

const { salesForEachOrder } = require('../controllers/sales_Controllers');
salesRouter.get("/sales", salesForEachOrder);

module.exports = { salesRouter };