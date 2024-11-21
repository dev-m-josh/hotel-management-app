const { newUserSchema } = require('../validators/validators')

//get all users
function addNewUser(req, res) {
    let pool = req.pool
    let addedUser = req.body;
 //validation
 const {error, value} = newUserSchema.validate(addedUser, {abortEarly: false});
 if (error) {
     console.log(error);
     res.json(error.details);
     return;
 };

 pool.query(`INSERT INTO users (username, user_email, user_password, user_role)
VALUES ('${value.username}', '${value.user_email}', '${value.user_password}', '${value.user_role}')`, (err, result) =>{
        //ERROR AND RESPONSE
        if (err) {
            console.log("error occured in query", err ); 
        } else {
            res.json({
                success: true,
                message: "User added successfully",
                rowsAffected: result.rowsAffected
            });
        };
    });
};

module.exports = { addNewUser }