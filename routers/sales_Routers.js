const salesRouter = require("express").Router();

const { salesForEachOrder, salesForAllOrders, salesForToday, previousdaySales, lastWeekSales, salesForSpecificTimeRange, mealSales } = require('../controllers/sales_Controllers');
salesRouter.get("/sales/orders", salesForEachOrder);
salesRouter.get("/sales", salesForAllOrders);
salesRouter.get("/sales/today", salesForToday);
salesRouter.get("/sales/previousday", previousdaySales);
salesRouter.get("/sales/pastweek", lastWeekSales);
salesRouter.get("/sales/timespan", salesForSpecificTimeRange);
salesRouter.get("/sales/meals", mealSales);

module.exports = { salesRouter };