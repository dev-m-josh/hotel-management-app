const { orderSchema } = require("../validators/validators");

//GET ALL ORDERS
function getOrders(req, res) {
  let pool = req.pool;
  pool.query(`select * from orders`, (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
      console.log("Error occured in query", err);
    }
    if (result.rowsAffected[0] === 0) {
      res.json({
        message: "No orders yet",
      });
    } else {
      res.json(result.recordset);
    }
  });
}


module.exports = { getOrders };
