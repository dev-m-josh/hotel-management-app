const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { newUserSchema, userLoginSchema,editUsernameSchema, editUserRoleSchema } = require("../validators/validators");

//get all users
function getAllStaffs(req, res) {
  let pool = req.pool;
  let { page, pageSize } = req.query;
  let offset = (Number(page) - 1) * Number(pageSize);
  pool.query(
    `SELECT * FROM users WHERE user_status = 'active' ORDER BY user_id OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
        console.log("Error occured in query", err);
      }else {
        res.json(result.recordset);
      }
    }
  );
}

//add new user
async function addNewUser(req, res) {
  let pool = req.pool;
  let addedUser = req.body;
  //validation
  const { error, value } = newUserSchema.validate(addedUser, {
    abortEarly: false,
  });
  if (error) {
    console.log(error);
    return res.status(400).json({ errors: error.details });
  }

  let password_hash = await bcrypt.hash(value.user_password, 5);

  let token = await jwt.sign({ addedUser }, "youcanguessthisright");

  pool.query(
    `INSERT INTO users (username, user_email, user_password, user_role, user_status)
VALUES ('${value.username}', '${value.user_email}', '${password_hash}', '${value.user_role}', 'active')`,
    (err, result) => {
      //ERROR AND RESPONSE
      if (err) {
        console.log("error occured in query", err);
      } else {
        res.json({
          success: true,
          message: "User added successfully",
          addedUser,
          token,
        });
      }
    }
  );
}

//login user
async function userLogin(req, res) {
  let pool = req.pool;
  let userDetails = req.body;

  // Validation
  const { error, value } = userLoginSchema.validate(userDetails, {
    abortEarly: false,
  });
  if (error) {
    console.log(error);
    return res.status(400).json({ errors: error.details });
  }

  // Query to find the user in the database
  let requestedUser = await pool.query(
    `SELECT user_id, username, user_email, user_role, user_password FROM users WHERE user_email = '${value.user_email}'`
  );
  let user = requestedUser.recordset[0];

  // If no user is found
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found!",
    });
  }

  // Compare passwords
  try {
    let passwordComparison = await bcrypt.compare(
      userDetails.user_password,
      user.user_password
    );

    // If the password matches
    if (passwordComparison) {
      // Remove the password from the user object before returning it
      const { user_password, ...userWithoutPassword } = user; 

      // Create a JWT token
      let token = jwt.sign({ user_id: user.user_id }, "youcanguessthisright");

      // Return the user details and token
      return res.json({
        message: "Logged in successfully",
        token,
        user: userWithoutPassword, // Send user details without the password
      });
    } else {
      return res.status(401).json({
        message: "Incorrect credentials!",
      });
    }
  } catch (error) {
    console.error("Error during password comparison:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

//EDIT USERNAME
function editUserName(req, res) {
  let pool = req.pool;
  let requestedUserId = req.params.userId;
  let userEdits = req.body;

  // Validation
  const { error, value } = editUsernameSchema.validate(userEdits, {
    abortEarly: false,
  });
  if (error) {
    console.log(error);
    return res.status(400).json({ errors: error.details });
  }

  pool.query(`
    UPDATE users
    SET username = '${userEdits.username}'
    WHERE user_id = '${requestedUserId}'`,(err,result) =>{
    console.log(result)
    if (err) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
      console.log("Error occured in query", err);
      return
    }
    // Check if any rows were affected
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${requestedUserId} not found.`,
      });
    } else {
      res.json({
        success: true,
        message: "Edit was successfully done.",
        rowsAffected: result.rowsAffected,
        newUserDetails: userEdits,
      });
    }
    }
  )
}

// EDIT USER ROLE
function editUserRole(req, res) {
  let pool = req.pool;
  let requestedUserId = req.params.userId;
  let userEdits = req.body;

  console.log(userEdits)
  // Validation
  const { error, value } = editUserRoleSchema.validate(userEdits, {
    abortEarly: false,
  });
  if (error) {
    console.log(error);
    return res.status(400).json({ errors: error.details });
  }

  pool.query(`
    UPDATE users
    SET user_role = '${userEdits.user_role}'
    WHERE user_id = '${requestedUserId}'`,(err,result) =>{
        console.log(result)
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
          return
        }
        // Check if any rows were affected
        if (result.rowsAffected[0] === 0) {
          return res.status(404).json({
            success: false,
            message: `User with ID ${requestedUserId} not found.`,
          });
        } else {
          res.json({
            success: true,
            message: "Edit was successfully done.",
            rowsAffected: result.rowsAffected,
            newUserDetails: userEdits,
          });
        }
      }
  )
}

//DELETE A USER
function deleteUser(req, res) {
  let pool = req.pool;
  let requestedId = req.params.userId;
  pool.query(
    `DELETE FROM users WHERE user_id = ${requestedId}`,
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
        res.status(400).json({
          success: false,
          message: "User not found!",
        });
        return;
      }

      //RESPONSE
      res.json({
        success: true,
        message: "User deleted successfully!",
        result: result.rowsAffected,
      });
    }
  );
}

module.exports = { getAllStaffs, addNewUser, userLogin, editUserName, editUserRole, deleteUser };
