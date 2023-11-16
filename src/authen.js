const { pool } = require('../initial');

const checkRfid = async (data ) =>{
    const queryStr = `SELECT rf_id ,auth_pin , fname , lname FROM smduser WHERE rf_id = $1 OR auth_pin = $1  `;
    const queryVlue = [data];
    return await pool.query(queryStr,queryVlue).then(async (result) => {
      if (result.rows && result.rows.length > 0) {
        return {
          status: 200,
          msg: result.rows,
        };
      } else {
        return {
          status: 204,
          msg: ['รหัสผิด'],
        };
      }
    }).catch((err) => {
      console.log("ERROR AT PG QUERY - GET USER");
      console.log(err);
      return {
        status: 500,
        msg: "INTERNAL ERROR",
      };
    });


}

 module.exports = {
   
    checkRfid
 }