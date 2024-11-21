const { newMealSchema } = require("../validators/validators");
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

  // Check if the logged-in user is an admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can add meals." });
  }

  // Insert the new meal into the database
  pool.query(
    `INSERT INTO menu_items (name, category, description, price) 
        VALUES ('${value.name}', '${value.category}', '${value.description}', '${value.price}')`,(err, result) => {
      if (err) {
        console.error("Error inserting new meal:", err);
      }else{
      // Return the new meal's ID or success message
      const newMealId = result.rows[0].meal_id;
      res.status(201).json({
        message: "Meal added successfully",
        meal_id: newMealId,
      });
      }
    }
  );
}

module.exports = { addNewMeal, getAllMeals };
