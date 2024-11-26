const {
  newMealSchema,
  availableServingsSchema,
} = require("../validators/validators");
//GET ALL MEALS
function getAllMeals(req, res) {
  let pool = req.pool;
  let { page, pageSize } = req.query;
  let offset = (Number(page) - 1) * Number(pageSize);
  pool.query(
    `SELECT * FROM menu_items ORDER BY meal_id OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
    (err, result) => {
      if (err) {
        console.log("error occured in query", err);
      } else {
        res.json(result.recordset);
      }
    }
  );
}

// ADD NEW MEAL
function addNewMeal(req, res) {
  const pool = req.pool;
  const newMeal = req.body;

  // Validation
  const { error, value } = newMealSchema.validate(newMeal, {
    abortEarly: false,
  });
  if (error) {
    console.log(error);
    return res.status(400).json({ errors: error.details });
  }

  // Insert the new meal into the database
  pool.query(
    `INSERT INTO menu_items (name, category, description, price) 
    VALUES ('${value.name}', '${value.category}', '${value.description}', '${value.price}')`,
    (err, result) => {
      if (err) {
        console.error("Error inserting new meal:", err);
      } else {
        res.status(201).json({
          message: "Meal added successfully",
        });
      }
    }
  );
};

//MOST TRENDING MEALS
function getTrendingMeals(req, res) {
  let pool = req.pool;
  let { page, pageSize } = req.query;
  let offset = (Number(page) - 1) * Number(pageSize);
  pool.query(
    `SELECT 
    mi.name AS meal_name,
    SUM(oi.quantity) AS total_orders
FROM 
    order_items oi
JOIN 
    orders o ON oi.order_id = o.order_id
JOIN 
    menu_items mi ON oi.meal_id = mi.meal_id
WHERE 
    o.created_at >= DATEADD(WEEK, -1, GETDATE())
GROUP BY 
    mi.name
ORDER BY 
    total_orders DESC OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
    (err, result) => {
      if (err) {
        console.log("error occured in query", err);
      } else {
        res.json(result.recordset);
      }
    }
  );
}

//tracking servings available on a particular day
function getAvailableServings(req, res) {
  let pool = req.pool;
  let { page, pageSize } = req.query;
  let offset = (Number(page) - 1) * Number(pageSize);

  pool.query(
    `SELECT * FROM available_servings_history ORDER BY day DESC OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
    (err, result) => {
      if (err) {
        console.log("error occured in query", err);
      } else {
        res.json(result.recordset);
      }
    }
  );
}

//ADD SERVINGS AVAILABLE
function addAvailableServings(req, res) {
  let pool = req.pool;
  let servings = req.body;

  //validate
  const { error, value } = availableServingsSchema.validate(servings, {
    abortEarly: false,
  });
  if (error) {
    console.log(error);
    res.json(error.details);
    return;
  }

  pool.query(
    `INSERT INTO available_servings_history ( meal_id, available_servings)
    VALUES ('${value.meal_id}', '${value.available_servings}')`,
    (err, result) => {
      //ERROR AND RESPONSE
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
        console.log("Error occured in query", err);
      } else {
        res.json({
          success: true,
          message: "available_servings set successfully",
        });
      }
    }
  );
}

module.exports = {
  addNewMeal,
  getAllMeals,
  getTrendingMeals,
  getAvailableServings,
  addAvailableServings,
};
