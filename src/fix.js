const { pool } = require('../initial');
const notification = require('./noti')
const getAllFixData = async () => {
    try {
        const queryStr = 'SELECT fix.fix_id, fix.user_id, fix.room_id, fix."timestamp", fix.state_id, fix.area, fix.description, fix.sub_phone, tb_user.username, tb_user.room_id, tb_user.phone_num, tb_state.state_name, room.room_num, room.building FROM fix INNER JOIN tb_user ON tb_user.user_id = fix.user_id INNER JOIN tb_state ON tb_state.state_id = fix.state_id INNER JOIN room ON room.room_id = tb_user.room_id ORDER BY fix.state_id, fix.timestamp DESC'

        const result = await pool.query(queryStr)
        if (!result) {
            return { status: 400, msg: 'Error get all fix data' };
        }

        return { status: 200, msg: result.rows };

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - get all fix data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

// fix user history
const getFixData = async (user_id, room_id) => {
    console.log(user_id)
    console.log(room_id)

    try {
        const queryStr = 'SELECT fix.fix_id, fix.user_id, fix.room_id, fix."timestamp", fix.state_id, fix.area, fix.description, fix.sub_phone, tb_user.username, tb_user.room_id, tb_state.state_name, room.room_num, room.building FROM fix INNER JOIN tb_user ON tb_user.user_id = fix.user_id INNER JOIN tb_state ON tb_state.state_id = fix.state_id INNER JOIN room ON room.room_id = tb_user.room_id WHERE fix.user_id = $1 AND fix.room_id = $2 ORDER BY fix.state_id, fix.timestamp DESC'
        const queryValue = [user_id, room_id]

        const result = await pool.query(queryStr,queryValue)
        if (!result) {
            return { status: 400, msg: 'Error get fix data' };
        }

        return { status: 200, msg: result.rows };

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - get fix data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}


// insert fix (admin)
const reqInsertFixData = async (data) => {
    try {
        const { user_id, area, description, sub_phone, room_id } = data
        const queryStr = 'INSERT INTO fix(user_id, area, description, sub_phone, room_id) VALUES($1, $2, $3, $4, $5); '
        const queryValue = [user_id, area,description, sub_phone, room_id]
        
        await pool.query("BEGIN")
        await pool.query(queryStr, queryValue)
        await pool.query("COMMIT")
        await  notification.notification('มีการแจ้งซ่อม' ,room_id)
        return { status: 200, msg: 'Success Req insert fix data' };
    

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - Req insert fix data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

const reqUpdateFixData = async (data) => {
    try {
        const { state_id, fix_id, user_id, room_id } = data
        const queryStr = 'UPDATE fix SET state_id = $1 WHERE fix_id = $2 AND user_id = $3 AND room_id = $4;'
        const queryValue = [state_id, fix_id, user_id, room_id]

        await pool.query("BEGIN")
        await pool.query(queryStr, queryValue)
        await pool.query("COMMIT")
    
        return { status: 200, msg: 'Success Req update fix data' };
    

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - Req update fix data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

module.exports = {
    getAllFixData,
    getFixData,
    reqInsertFixData,
    reqUpdateFixData
}