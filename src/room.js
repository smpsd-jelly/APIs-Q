const { pool } = require('../initial');

const getRoomData = async () => {
    try {
        const queryStr = 'SELECT * FROM room WHERE register = false ORDER BY room_num ASC'

        const result = await pool.query(queryStr)
        if (!result) {
            return { status: 400, msg: 'Error get room data' };
        }

        return { status: 200, msg: result.rows };

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - register");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}
const getAllRoomData = async () => {
    try {
        const queryStr = 'SELECT room.*, tb_user.user_id FROM room INNER JOIN tb_user on tb_user.room_id = room.room_id ORDER BY room.room_num ASC'

        const result = await pool.query(queryStr)
        if (!result) {
            return { status: 400, msg: 'Error get room data' };
        }

        return { status: 200, msg: result.rows };

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - register");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

module.exports = {
    getRoomData,
    getAllRoomData
}