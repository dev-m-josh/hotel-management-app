const express = require("express");
const cors = require('cors');
const sql  =require("mssql");
const { mealsRouter } = require('./routers/auth_routers')
const { usersRouter } = require("./routers/users_Routers");
require("dotenv").config();
const {config} = require("./config/db_config");

async function startServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));

    app.get('/home', (req,res) =>{
        res.json('welcome home')
    })

    try {
        //CONNECT TO DATABASE
        let pool = new sql.ConnectionPool(config);
        await pool.connect()
        if (pool.connected) {
            console.log("Database connected successfully")
        }
        app.use(function(req, res, next){
            req.pool = pool;
            next()
        })

        app.use(mealsRouter);
        app.use(usersRouter)

        const port = 3000;
        app.listen(port, ()=>{
        console.log(`Sever listening to port: ${port}`)
        });

    } catch (error) {
        console.log(error)
    }

}

startServer()