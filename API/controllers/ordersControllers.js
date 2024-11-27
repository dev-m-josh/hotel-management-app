const { orderSchema, orderEditSchema } = require("../validators/validators");

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
          placedOrder,
        });
      }
    }
  );
}

//DELETE AN ORDER
function deleteAnOrder(req, res) {
  let pool = req.pool;
  let orderToDelete = req.params.orderId;
  pool.query(
    `DELETE FROM orders WHERE order_id = ${orderToDelete}`,
    (err, result) => {
      //ERROR CHECK
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
        console.log("Error occured in query", err);
      }

      //CHECK IF REQUESTED USER IS AVAILABLE
      if (result.rowsAffected[0] === 0) {
        res.json({
          success: false,
          message: "Order not found!",
        });
        return;
      }

      //RESPONSE
      res.json({
        success: true,
        message: "Order deleted successfully!",
        result: result.rowsAffected,
      });
    }
  );
}

//EDIT AN ORDER
function updateAnOrder(req, res) {
  let pool = req.pool;
  let orderToEdit = req.params.orderId;
  let orderEditDetails = req.body;

  //validation
  const { error, value } = orderEditSchema.validate(orderEditDetails, {
    abortEarly: false,
  });
  if (error) {
    console.log(error);
    res.send(error.details.message);
    return;
  }

  pool.query(
    `UPDATE orders
      SET order_status = '${value.order_status}' WHERE order_id = '${orderToEdit}'`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
        console.log("Error occured in query", err);
      }
      // Check if any rows were affected
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          success: false,
          message: `Order with ID ${orderToEdit} not found.`,
        });
      } else {
        res.json({
          success: true,
          message: "Order status updated successfully.",
          orderStatus: orderEditDetails
        });
      }
    }
  );
}

module.exports = { getOrders, placeAnOrder, deleteAnOrder, updateAnOrder };
