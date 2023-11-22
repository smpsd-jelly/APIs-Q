const { pool } = require('../initial');

const reqLoginUser = async (data) => {
  try {
    const { username, password } = data
    const queryStr = `SELECT * FROM tb_user WHERE username = $1 AND password = $2 limit 1 `;
    const queryValue = [username, password];

    const result = await pool.query(queryStr,queryValue)
    if (!result) {
      return { status: 400, msg: 'Error get room data' };
    }

    if(result.rowCount <1 ){
      return { status: 204, msg: []};
    }
    return { status: 200, msg: result.rows[0] };

  } catch (err) {
    console.log("ERROR AT PG QUERY - GET USER");
    console.log(err);
    return { status: 500, msg: "INTERNAL ERROR" };
  };


}

const register = async (data) => {
  try {
    const { username, password, phone_num, room_id } = data
    const queryStr = 'INSERT INTO tb_user (username,password,phone_num,room_id) VALUES ($1,$2,$3,$4)'
    const queryValue = [username, password, phone_num, room_id]

    await pool.query("BEGIN")
    await pool.query(queryStr, queryValue)
    await pool.query("COMMIT")

    return { status: 200, msg: 'Register Success' };



  } catch (err) {
    await pool.query('ROLLBACK')
    console.log("ERROR AT PG QUERY - register");
    console.log(err)
    return { status: 500, msg: "INTERNAL ERROR" };
  }
}

module.exports = {
  reqLoginUser,
  register
}