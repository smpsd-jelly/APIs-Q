const { pool } = require('../initial');
const notification = require('./noti')

const getAllSlipData = async () => {
    try {
        // const queryStr = 'SELECT slip.slip_id, slip.date, slip.slip_time, slip.img_url, slip.bills_id, slip.user_id, slip.room_id, slip.bills_state_name, slip.bills_state_id 	FROM slip INNER JOIN room on room.room_id = slip.room_id INNER JOIN tb_user on tb_user.room_id = room.room_id INNER JOIN tb_state_bills on tb_state_bills.bills_state_id = slip.bills_state_id INNER JOIN bills on bills.index = slip.bills_id'

        const queryStr = 'SELECT slip.slip_id, slip.date, slip.slip_time, slip.img_url, slip.user_id, slip.room_id, slip.bills_id,  bills.building, bills.room_num, tb_user.phone_num,  bills.month_year, bills.electric_lastmonth, bills.electric_current, bills.electric_used, bills.water_lastmonth, bills.water_current, bills.water_used,bills.index, bills.rent, tb_state_bills.bills_state_name, tb_state_bills.bills_state_id,(SELECT COUNT(clean_id)  FROM clean WHERE state_id = 3 AND user_id = tb_user.user_id) as clean_count FROM slip INNER JOIN room on room.room_id = slip.room_id INNER JOIN tb_user on tb_user.room_id = room.room_id FULL JOIN clean on clean.user_id = tb_user.user_id INNER JOIN bills on bills.index = slip.bills_id INNER JOIN tb_state_bills on tb_state_bills.bills_state_id = bills.bills_state_id ORDER BY  tb_state_bills.bills_state_id, bills.month_year,slip.date,slip.slip_time DESC'

        const result = await pool.query(queryStr)
        if (!result) {
            return { status: 400, msg: 'Error get all slip data' };
        }

        return { status: 200, msg: result.rows };

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - get all slip data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

const getSlipData = async (user_id, room_id) => {
    try {
        const queryStr = 'SELECT slip.slip_id, slip.date, slip.slip_time, slip.img_url, slip.user_id, slip.room_id, slip.bills_id,  bills.building, bills.room_num, tb_user.phone_num,  bills.month_year, bills.electric_lastmonth, bills.electric_current, bills.electric_used, bills.water_lastmonth, bills.water_current, bills.water_used,bills.index, bills.rent, tb_state_bills.bills_state_name, tb_state_bills.bills_state_id,(SELECT COUNT(clean_id)  FROM clean WHERE state_id = 3 AND user_id = tb_user.user_id) as clean_count FROM slip INNER JOIN room on room.room_id = slip.room_id INNER JOIN tb_user on tb_user.room_id = room.room_id FULL JOIN clean on clean.user_id = tb_user.user_id INNER JOIN bills on bills.index = slip.bills_id INNER JOIN tb_state_bills on tb_state_bills.bills_state_id = bills.bills_state_id WHERE slip.user_id = $1 AND slip.room_id = $2  ORDER BY slip.bills_state_id DESC'
        const queryValue = [user_id, room_id]

        const result = await pool.query(queryStr, queryValue)
        if (!result) {
            return { status: 400, msg: 'Error get slip data' };
        }

        return { status: 200, msg: result.rows };

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - get slip data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

const reqInsertSlipData = async (data) => {
    console.log(data)
    try {
        const { date, slip_time, img_url, bills_id, user_id, room_id } = data
        const queryStr = 'INSERT INTO slip(date, slip_time, img_url,bills_id, user_id, room_id ) VALUES ($1, $2, $3, $4, $5, $6 );'
        const queryValue = [date, slip_time, img_url, bills_id, user_id, room_id]
        const queryStr2 = 'UPDATE bills SET bills_state_id = 2 WHERE index = $1'
        const queryValue2 = [bills_id]

        await pool.query("BEGIN")
        await pool.query(queryStr, queryValue)
        await pool.query(queryStr2, queryValue2)
        await pool.query("COMMIT")
        await  notification.notification('มีการแจ้งชำระเงิน' ,room_id)

        return { status: 200, msg: 'Success Req insert Slip data' };


    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - Req insert Slip data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

// const reqUpdateSlipData = async (data) => {
//     console.log(data)
//     try {
//         const {  slip_id, user_id, room_id } = data
//         const queryStr = 'UPDATE slip SET bills_state_id = 2 WHERE slip_id = 40 AND user_id = $2 AND room_id = $3'
//         const queryValue = [ slip_id, user_id, room_id ]

//         await pool.query("BEGIN")
//         await pool.query(queryStr, queryValue)
//         await pool.query("COMMIT")

//         return { status: 200, msg: 'Success Req update slip data' };


//     } catch (err) {
//         await pool.query('ROLLBACK')
//         console.log("ERROR AT PG QUERY - Req update slip data");
//         console.log(err)
//         return { status: 500, msg: "INTERNAL ERROR" };
//     }
// }

module.exports = {
    getAllSlipData,
    getSlipData,
    reqInsertSlipData,
    // reqUpdateSlipData
}