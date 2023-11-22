const { pool } = require('../initial');

const getAllCleanData = async () => {
    try {
        const queryStr = 'SELECT clean.clean_id, clean.user_id, clean."timestamp", clean.state_id, clean.description, clean.sub_phone, tb_user.username, tb_user.room_id, tb_state.state_name, room.room_num, room.building FROM clean INNER JOIN tb_user ON tb_user.user_id = clean.user_id INNER JOIN tb_state ON tb_state.state_id = clean.state_id INNER JOIN room ON room.room_id = tb_user.room_id ORDER BY clean.state_id, clean.timestamp DESC'

        const result = await pool.query(queryStr)
        if (!result) {
            return { status: 400, msg: 'Error get all clean data' };
        }

        return { status: 200, msg: result.rows };

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - get all clean data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

// clean user history
const getCleanData = async (user_id) => {
    console.log(user_id);
    try {
        const queryStr = 'SELECT clean.clean_id, clean.user_id, clean."timestamp", clean.state_id, clean.description, clean.sub_phone, tb_user.username, tb_user.room_id, tb_state.state_name, room.room_num, room.building FROM clean INNER JOIN tb_user ON tb_user.user_id = clean.user_id INNER JOIN tb_state ON tb_state.state_id = clean.state_id INNER JOIN room ON room.room_id = tb_user.room_id WHERE clean.user_id = $1 ORDER BY clean.state_id, clean.timestamp DESC'
        const queryValue = [user_id]

        const result = await pool.query(queryStr,queryValue)
        if (!result) {
            return { status: 400, msg: 'Error get clean data' };
        }

        return { status: 200, msg: result.rows };

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - get clean data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}


// insert clean (admin)
const reqInsertCleanData = async (data) => {
    try {
        const { user_id, description, sub_phone } = data
        const queryStr = 'INSERT INTO clean(user_id, description, sub_phone) VALUES($1, $2, $3); '
        const queryValue = [user_id, description, sub_phone]

        await pool.query("BEGIN")
        await pool.query(queryStr, queryValue)
        await pool.query("COMMIT")
    
        return { status: 200, msg: 'Success Req insert clean data' };
    

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - Req insert clean data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

const reqUpdateCleanData = async (data) => {
    try {
        const { state_id, clean_id, user_id } = data
        const queryStr = 'UPDATE clean SET state_id = $1 WHERE clean_id = $2 AND user_id = $3;'
        const queryValue = [state_id, clean_id, user_id]

        await pool.query("BEGIN")
        await pool.query(queryStr, queryValue)
        await pool.query("COMMIT")
    
        return { status: 200, msg: 'Success Req update clean data' };
    

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - Req update clean data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

module.exports = {
    getAllCleanData,
    getCleanData,
    reqInsertCleanData,
    reqUpdateCleanData
}