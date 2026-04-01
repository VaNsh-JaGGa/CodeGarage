const pool = require('./db');
async function GetUsers(){
    try{
        const result = await pool.query('SELECT * FROM users');
        // console.log(result);
        console.log(result.rows);
    }
    catch(error){
        console.log("error is ->>>>" , error);
    }
    finally{
        await pool.end();
    }
}

GetUsers();