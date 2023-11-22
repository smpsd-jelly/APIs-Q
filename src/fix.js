const { pool } = require('../initial');

const getAllFixData = async () => {
    try {
        const queryStr = 'SELECT * FROM fix ORDER BY timestamp DESC'

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
const getFixData = async (user_id) => {
    console.log(user_id);
    try {
        const queryStr = 'SELECT * FROM fix WHERE user_id = $1 ORDER BY timestamp DESC'
        const queryValue = [user_id]

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
        const { user_id, area, description, sub_phone } = data
        const queryStr = 'INSERT INTO fix(user_id, area, description, sub_phone) VALUES($1, $2, $3, $4); '
        const queryValue = [user_id, area,description, sub_phone]

        await pool.query("BEGIN")
        await pool.query(queryStr, queryValue)
        await pool.query("COMMIT")
    
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
        const { state_id, fix_id, user_id } = data
        const queryStr = 'UPDATE fix SET state_id = $1 WHERE fix_id = $2 AND user_id = $3;'
        const queryValue = [state_id, fix_id, user_id]

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