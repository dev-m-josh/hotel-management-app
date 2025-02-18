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
};

//sales for today
function salesForToday(req, res) {
  let pool = req.pool;
  pool.query(
    `SELECT 
    SUM(oi.quantity * mi.price) AS total_sales
FROM 
    order_items oi
JOIN 
    menu_items mi ON oi.meal_id = mi.meal_id
JOIN
    orders o ON oi.order_id = o.order_id
WHERE 
    o.created_at >= CAST(GETDATE() AS DATE)`,
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
          message: "No sales made today",
        });
      } else {
        res.json(result.recordset);
      }
    }
  );
}

//sales for specific date range
function salesForSpecificTimeRange(req, res) {
  let {start, end} = req.query;
  let pool = req.pool;
  pool.query(
    `SELECT 
    SUM(oi.quantity * mi.price) AS total_sales
FROM 
    order_items oi
JOIN 
    menu_items mi ON oi.meal_id = mi.meal_id
JOIN 
    orders o ON oi.order_id = o.order_id
WHERE 
    o.created_at >= '${start}'
    AND o.created_at < '${end}'`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
        console.log("Error occured in query", err);
      }
      if (result.recordsettotal_sales === null) {
        res.json({
          message: "No sales made during this period",
        });
      } else {
          console.log(result.recordset)
        res.json(result.recordset[0]);
      }
    }
  );
};

module.exports = {
  salesForEachOrder,
  salesForToday,
  salesForSpecificTimeRange,
};
