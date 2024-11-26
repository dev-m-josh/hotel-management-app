const salesRouter = require("express").Router();

const {
  salesForEachOrder,
  salesForToday,
  salesForSpecificTimeRange,
} = require("../controllers/sales_Controllers");
salesRouter.get("/orders", salesForEachOrder);
salesRouter.get("/today", salesForToday);
salesRouter.get("/timespan", salesForSpecificTimeRange);

module.exports = { salesRouter };
