const jwt = require('jsonwebtoken')

//VERIFY TOKEN
function verifyToken(req, res, next) {
try {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
    //SPLIT bearerHeader AND GET THE TOKEN ONLY
    const token = bearerHeader.split(' ')[1];
    let verification = jwt.verify(token, 'youcanguessthisright');
        req.user = verification
        next();    
    }else{
        next({
            success: false,
            status: 401,
            message: "No token found!"
        });
    };
    } catch (error) {
        res.sendStatus(401);
    }

};

//handle error of undefine route
function routesErrorHandler(req, res) {
    res.status(404).json({
        success: false,
        message: "Route not defined!"
    })
}

//handle all errors
function errorHandler(err, req, res, next){
    res.sendStatus(err.status);
};


module.exports = { verifyToken, routesErrorHandler, errorHandler }