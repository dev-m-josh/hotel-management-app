const {
  orderSchema,
  orderEditsSchema,
  orderItemsSchema,
  orderStatusSchema,
} = require("../validators/validators");

//GET COMPLETED ORDERS
function getOrders(req, res) {
  let pool = req.pool;
  let { page, pageSize } = req.query;
  let offset = (Number(page) - 1) * Number(pageSize);
  pool.query(
    `SELECT 
    o.order_id, 
    oi.order_items_id, 
    oi.quantity,
    mi.name AS meal_name, 
    mi.price AS meal_price,
    (oi.quantity * mi.price) AS total_cost
FROM 
    orders o
JOIN 
    order_items oi ON o.order_id = oi.order_id
JOIN 
    menu_items mi ON oi.meal_id = mi.meal_id
WHERE 
    o.order_status = 'served'
ORDER BY 
    o.order_id, oi.order_items_id  OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY;
`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
        console.log("Error occured in query", err);
      } else {
        res.json(result.recordset);
      }
    }
  );
}

//GET PENDING ORDERS
function getPendingOrders(req, res) {
  let pool = req.pool;
  let { page, pageSize } = req.query;
  let offset = (Number(page) - 1) * Number(pageSize);
  pool.query(
    `SELECT * 
FROM orders 
WHERE order_status = 'pending' 
ORDER BY order_id  
OFFSET ${offset} ROWS 
FETCH NEXT ${pageSize} ROWS ONLY;
`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
        console.log("Error occured in query", err);
      } else {
        res.json(result.recordset);
      }
    }
  );
}

//PLACE AN ORDER
function placeAnOrder(req, res) {
  let pool = req.pool;
  let placedOrder = req.body;

  // Validation
  const { error, value } = orderSchema.validate(placedOrder, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  // Your current query
  pool.query(
    `INSERT INTO orders (waiter_id, table_number, order_status)
     OUTPUT INSERTED.order_id
     VALUES ('${value.waiter_id}', '${value.table_number}', '${value.order_status}')`,
    (err, result) => {
      if (err) {
        console.error("Error inserting new order:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        const orderId = result.recordset[0].order_id; // Access the generated order_id

        // Respond with the generated order_id
        res.status(201).json({
          message: "Order created successfully",
          orderId: orderId, // Send back the generated ID
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

      //CHECK IF REQUESTED ORDER IS AVAILABLE
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
  const { error, value } = orderStatusSchema.validate(orderEditDetails, {
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
      if (!result.rowsAffected) {
        return res.status(404).json({
          success: false,
          message: `Order with ID ${orderToEdit} not found.`,
        });
      } else {
        res.json({
          success: true,
          message: "Order status updated successfully.",
          orderStatus: orderEditDetails,
        });
      }
    }
  );
}

/*GET ORDER ITEMS*/
function getOrderItems(req, res) {
  let orderId = req.params.orderId;
  let pool = req.pool;
  pool.query(
    `SELECT 
    o.order_id, 
    oi.order_items_id, 
    oi.quantity,
    mi.name AS meal_name, 
    mi.price AS meal_price,
    (oi.quantity * mi.price) AS total_cost
FROM 
    orders o
JOIN 
    order_items oi ON o.order_id = oi.order_id
JOIN 
    menu_items mi ON oi.meal_id = mi.meal_id
WHERE 
    o.order_status = 'pending' AND o.order_id = ${orderId}
ORDER BY 
    o.order_id, oi.order_items_id`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
        console.log("Error occured in query", err);
        return;
      }
      if (result.rowsAffected[0] === 0) {
        res.json({
          message: "No selected order items",
        });
      } else {
        res.json(result.recordset);
      }
    }
  );
}

const updateOrderItems = async (req, res) => {
  const receivedItems = req.body;
  console.log("Items received:", receivedItems);

  try {
    // Validate the array of items using the defined Joi schema
    const { error } = orderEditsSchema.validate(receivedItems);

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details,
      });
    }

    // Ensure that quantity is a number
    receivedItems.forEach((item) => {
      item.quantity = parseInt(item.quantity, 10);
    });

    // Construct the values string for insertion
    const values = receivedItems
      .map((item) => `(${orderId}, ${item.meal_id}, ${item.quantity})`)
      .join(", ");

    const query = `
      INSERT INTO order_items (order_id, meal_id, quantity)
      VALUES ${values};
    `;

    await req.pool.query(query); // Execute the query with all values at once
    console.log("Order Items Inserted:", receivedItems);

    // Send a proper response
    res.status(201).json({
      message: "Items added successfully",
      order_items: receivedItems
    });
  } catch (err) {
    console.error("Error inserting new meal:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//SELECT ORDER ITEMS
const selectOrderItems = async (req, res) => {
  const receivedItems = req.body;
  console.log("Items received:", receivedItems);

  try {
    // Validate the array of items using the defined Joi schema
    const { error } = orderItemsSchema.validate(receivedItems);

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details,
      });
    }

    // Ensure that quantity is a number
    receivedItems.forEach((item) => {
      item.quantity = parseInt(item.quantity, 10); // Convert to number if it's a string
    });

    // Construct the values string for insertion
    const values = receivedItems
      .map((item) => `(${item.order_id}, ${item.meal_id}, ${item.quantity})`)
      .join(", ");

    const query = `
      INSERT INTO order_items (order_id, meal_id, quantity)
      VALUES ${values};
    `;

    await req.pool.query(query); // Execute the query with all values at once
    console.log("Order Items Inserted:", receivedItems);

    // Send a proper response without any circular reference
    res.status(201).json({
      message: "Items added successfully",
    });
  } catch (err) {
    console.error("Error inserting new meal:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//EDIT ORDER ITEMS
function editOrderItems(req, res) {
  let pool = req.pool;
  let itemToEdit = req.params.itemId;
  let edits = req.body;
  pool.query(
    `UPDATE order_items
      SET quantity = '${edits.quantity}' WHERE order_id = '${itemToEdit}'`,
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
          message: `Order item with ID ${itemToEdit} not found.`,
        });
      } else {
        res.json({
          success: true,
          message: "Order item updated successfully.",
          quantity: edits,
        });
      }
    }
  );
}

//DELETE ORDER ITEM
function deleteOrderItem(req, res) {
  let pool = req.pool;
  let itemToDelete = req.params.itemId;
  pool.query(
    `DELETE FROM order_items WHERE order_items_id = ${itemToDelete}`,
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
          message: "Item not found!",
        });
        return;
      }

      //RESPONSE
      res.json({
        success: true,
        message: "Item deleted successfully!",
      });
    }
  );
}

module.exports = {
  getOrders,
  placeAnOrder,
  deleteAnOrder,
  updateAnOrder,
  updateOrderItems,
  getOrderItems,
  selectOrderItems,
  editOrderItems,
  deleteOrderItem,
  getPendingOrders,
};
