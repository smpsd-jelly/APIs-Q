const { pool } = require('../initial');
const md5 = require('js-md5');

const reqLoginUser = async (data) => {
  try {
    const { username, password } = data
    const password_hash = md5(password)
    const queryStr = `SELECT * FROM tb_user WHERE username = $1 AND password = $2 limit 1 `;
    const queryValue = [username, password_hash];

    const result = await pool.query(queryStr, queryValue)
    if (!result) {
      return { status: 400, msg: 'Error get room data' };
    }

    if (result.rowCount < 1) {
      return { status: 204, msg: [] };
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
    const { username, password, phone_num, room_id, create_by_admin } = data
    const password_hash = md5(password)
    const queryStr = 'INSERT INTO tb_user (username,password,phone_num,room_id,create_by_admin) VALUES ($1,$2,$3,$4,$5)'
    const queryValue = [username, password_hash, phone_num, room_id, create_by_admin]

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

const reqUpdatePasswordData = async (data) => {
  console.log(data)
  try {
    const { password, user_id } = data
    const password_hash = md5(password)
    const queryStr = `UPDATE tb_user SET password= $1 ,first_login= 'true' WHERE  user_id= $2;`
    const queryValue = [password_hash, user_id]

    await pool.query("BEGIN")
    await pool.query(queryStr, queryValue)
    console.log(queryValue)
    await pool.query("COMMIT")

    return { status: 200, msg: 'Success Req update password data' };


  } catch (err) {
    await pool.query('ROLLBACK')
    console.log("ERROR AT PG QUERY - Req update password data");
    console.log(err)
    return { status: 500, msg: "INTERNAL ERROR" };
  }
}

const getAllUserData = async () => {
  try {
    // const queryStr = 'SELECT tb_user.user_id, tb_user.username, tb_user.password, tb_user.admin, tb_user.phone_num, tb_user.room_id, tb_user.create_by_admin, tb_user.create_date, tb_user.first_login, room.room_num, room.building FROM tb_user INNER JOIN room on tb_user.room_id = room.room_id ORDER BY room.room_num ASC;'

const queryStr = 'SELECT tb_user.user_id, tb_user.username, tb_user.password, tb_user.admin, tb_user.phone_num, tb_user.room_id, tb_user.create_by_admin, tb_user.create_date, tb_user.first_login, room.room_num, room.building,creator.username AS created_by_username FROM tb_user INNER JOIN room ON tb_user.room_id = room.room_id LEFT JOIN tb_user AS creator ON creator.user_id = tb_user.create_by_admin ORDER BY room.room_num ASC;'

    const result = await pool.query(queryStr)
    if (!result) {
      return { status: 400, msg: 'Error get all user data' };
    }

    return { status: 200, msg: result.rows };

  } catch (err) {
    await pool.query('ROLLBACK')
    console.log("ERROR AT PG QUERY - get all user data");
    console.log(err)
    return { status: 500, msg: "INTERNAL ERROR" };
  }
}


module.exports = {
  reqLoginUser,
  register,
  reqUpdatePasswordData,
  getAllUserData
}