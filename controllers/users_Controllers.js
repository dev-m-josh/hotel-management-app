const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { newUserSchema, userLoginSchema } = require("../validators/validators");

//get all users
async function addNewUser(req, res) {
  let pool = req.pool;
  let addedUser = req.body;
  //validation
  const { error, value } = newUserSchema.validate(addedUser, {
    abortEarly: false,
  });
  if (error) {
    console.log(error);
    res.json(error.details);
    return;
  }

  let password_hash= await bcrypt.hash (value.user_password, 5);

  let token = await jwt.sign({ addedUser }, "youcanguessthisright");

  pool.query(
    `INSERT INTO users (username, user_email, user_password, user_role)
VALUES ('${value.username}', '${value.user_email}', '${password_hash}', '${value.user_role}')`,
    (err, result) => {
      //ERROR AND RESPONSE
      if (err) {
        console.log("error occured in query", err);
      } else {
        res.json({
          success: true,
          message: "User added successfully",
          token,
        });
      }
    }
  );
}

//USER LOGIN
async function userLogin(req, res) {
  let pool = req.pool;
  let userDetails = req.body;

  //validation
  const { error, value } = userLoginSchema.validate(userDetails, {
    abortEarly: false,
  });
  if (error) {
    console.log(error);
    res.send(error.details.message);
    return;
  }

  let requestedUser = await pool.query(
    `select username, user_email, user_password, user_role from  users where user_email = '${value.user_email}'`
  );
  let user = requestedUser.recordset[0];

  //response
  if (!user) {
    res.json({
      success: false,
      message: "User not found!",
    });
    return;
  }

  let token = await jwt.sign({ user }, "youcanguessthisright");

  try {
    let passwordComparisson = await bcrypt.compare(
      userDetails.user_password,
      user.user_password
    );

    if (passwordComparisson) {
      res.json({
        Message: "logged successfully",
        token,
      });
    } else {
      res.json({
        Message: "Wrong creditials!",
      });
    }
  } catch (error) {
    res.status(500).json(error, {
      Message: "Internal sever error",
    });
  }
}

module.exports = { addNewUser, userLogin };
