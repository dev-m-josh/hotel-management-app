//sales for each order
function salesForEachOrder(req, res) {
  let pool = req.pool;
  pool.query(
    `SELECT 
    oi.order_id,
    oi.meal_id,
    mi.name AS meal_name,
    oi.quantity,
    mi.price,
    (oi.quantity * mi.price) AS total_cost
FROM 
    order_items oi
JOIN 
    menu_items mi ON oi.meal_id = mi.meal_id`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
        console.log("Error occured in query", err);
      }
      if (result.rowsAffected[0] === 0) {
        res.json({
          message: "No sales made yet",
        });
      } else {
        res.json(result.recordset);
      }
    }
  );
}

//sales for all orders
function salesForAllOrders(req, res) {
  let pool = req.pool;
  pool.query(
    `SELECT 
    SUM(oi.quantity * mi.price) AS total_sales
FROM 
    order_items oi
JOIN 
    menu_items mi ON oi.meal_id = mi.meal_id`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
        console.log("Error occured in query", err);
      }
      if (result.rowsAffected[0] === 0) {
        res.json({
          message: "No sales made yet",
        });
      } else {
        res.json(result.recordset);
      }
    }
  );
}

module.exports = { salesForEachOrder, salesForAllOrders };
