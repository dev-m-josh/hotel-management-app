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

//PLACE AN ORDER
function placeAnOrder(req, res) {
  let pool = req.pool;
  let placedOrder = req.body;
  //validation
  const { error, value } = orderSchema.validate(placedOrder, {
    abortEarly: false,
  });
  if (error) {
    console.log(error);
    res.json(error.details);
    return;
  }

  pool.query(
    `INSERT INTO orders (waiter_id, table_number, order_status)
VALUES ('${value.waiter_id}', '${value.table_number}', '${value.order_status}')`,
    (err, result) => {
        
      if (err) {
        console.error("Error inserting new meal:", err);
      } else {
        res.status(201).json({
          message: "Order placed successfully",
          placedOrder
        });
      }
    }
  );
}

module.exports = { getOrders, placeAnOrder };
