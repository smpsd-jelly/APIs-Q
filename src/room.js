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

module.exports = {
    getRoomData
}