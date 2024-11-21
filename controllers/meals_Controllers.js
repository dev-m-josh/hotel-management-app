//GET ALL MEALS
function getAllMeals(req, res) {
    let pool = req.pool
    let { page, pageSize} = req.query;
    let offset = (Number(page)-1) * Number(pageSize);
    pool.query(`SELECT * FROM menu_items ORDER BY meal_id OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,(err, result)=>{
        if (err) {
            console.log("error occured in query", err );
        }else{
            res.json(result.recordset)
        };
    });
};

module.exports = { getAllMeals }