const { query } = require('express');
const { pool } = require('../initial');

const getAllBillsData = async () => {
    try {
        // const queryStr = 'SELECT bills.building, bills.room_num, bills.electric_lastmonth, bills.electric_current, bills.electric_used, bills.water_lastmonth, bills.water_current,bills.water_used, bills.room_id, bills.month_year, bills.index, tb_user.user_id, tb_user.phone_num , tb_state_bills.bills_state_name, tb_state_bills.bills_state_id, bills.rent, slip.date, slip.slip_time, slip.img_url, (SELECT COUNT( clean_id)  FROM clean WHERE state_id = 3 AND user_id = tb_user.user_id) as clean_count FROM bills INNER JOIN room on room.room_id = bills.room_id INNER JOIN tb_user on tb_user.room_id = room.room_id FULL JOIN clean on clean.user_id = tb_user.user_id INNER JOIN tb_state_bills on tb_state_bills.bills_state_id = bills.bills_state_id INNER JOIN slip on slip.bills_id = bills.index  GROUP BY bills.building, bills.room_num, bills.electric_lastmonth, bills.electric_current, bills.electric_used, bills.water_lastmonth, bills.water_current, bills.water_used, bills.room_id, bills.month_year, bills.index, tb_user.user_id, tb_user.phone_num, tb_state_bills.bills_state_name,  tb_state_bills.bills_state_id, bills.rent, slip.date, slip.slip_time, slip.img_url ORDER BY tb_state_bills.bills_state_id, bills.month_year DESC;'

        const queryStr = `SELECT bills.building, 
        bills.room_num,
        bills.electric_lastmonth, 
        bills.electric_current, 
        bills.electric_used,
        bills.water_lastmonth,
        bills.water_current,
        bills.water_used, 
        bills.room_id,
        bills.month_year,
        bills.index,
        tb_user.user_id,
        tb_user.phone_num ,
        tb_state_bills.bills_state_name,
        tb_state_bills.bills_state_id, 
        bills.rent, 
        COUNT(clean.clean_id) as clean_count
        FROM bills 
        INNER JOIN room 
        on room.room_id = bills.room_id 
        INNER JOIN tb_user 
        on tb_user.room_id = room.room_id 
        LEFT JOIN clean 
        on clean.user_id = tb_user.user_id 
        AND EXTRACT(YEAR FROM clean.timestamp) = EXTRACT(YEAR FROM bills.month_year)
        AND EXTRACT(MONTH FROM clean.timestamp) = EXTRACT(MONTH FROM bills.month_year)
        AND state_id = 3
        INNER JOIN tb_state_bills 
        on tb_state_bills.bills_state_id = bills.bills_state_id 
        GROUP BY bills.building, bills.room_num, bills.electric_lastmonth, bills.electric_current, bills.electric_used, bills.water_lastmonth, bills.water_current, bills.water_used, bills.room_id, bills.month_year, bills.index, tb_user.user_id, tb_user.phone_num, tb_state_bills.bills_state_name, tb_state_bills.bills_state_id, bills.rent 
        ORDER BY tb_state_bills.bills_state_id, bills.month_year DESC;`;


        const result = await pool.query(queryStr)
        if (!result) {
            return { status: 400, msg: 'Error get all bills data' };
        }

        return { status: 200, msg: result.rows };

    } catch (err) {
        console.log("ERROR AT PG QUERY - get all bills data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

const getBillsData = async (room_id) => {
    try {
        const queryStr = `SELECT bills.building, 
                                 bills.room_num,
                                 bills.electric_lastmonth,
                                 bills.electric_current,
                                 bills.electric_used, 
                                 bills.water_lastmonth, 
                                 bills.water_current,
                                 bills.water_used,
                                 bills.room_id,
                                 bills.month_year, 
                                 bills.index,
                                 tb_user.user_id, 
                                 tb_user.phone_num ,
                                 tb_state_bills.bills_state_name,  
                                 tb_state_bills.bills_state_id,
                                 bills.rent,
                                 COUNT(clean.clean_id) as clean_count
                          FROM bills 
                          INNER JOIN room on room.room_id = bills.room_id 
                          INNER JOIN tb_user on tb_user.room_id = room.room_id 
                          LEFT JOIN clean on clean.user_id = tb_user.user_id 
                          AND EXTRACT(YEAR FROM clean.timestamp) = EXTRACT(YEAR FROM bills.month_year)
                          AND EXTRACT(MONTH FROM clean.timestamp) = EXTRACT(MONTH FROM bills.month_year)
                          AND state_id = 3
                          INNER JOIN tb_state_bills 
                          on tb_state_bills.bills_state_id = bills.bills_state_id 
                          WHERE bills.room_id = $1 
                          GROUP BY bills.building,
                                   bills.room_num,
                                   bills.electric_lastmonth,
                                   bills.electric_current,
                                   bills.electric_used,
                                   bills.water_lastmonth,
                                   bills.water_current, 
                                   bills.water_used, 
                                   bills.room_id, 
                                   bills.month_year, 
                                   bills.index, 
                                   tb_user.user_id, 
                                   tb_user.phone_num, 
                                   tb_state_bills.bills_state_name,
                                   tb_state_bills.bills_state_id, 
                                   bills.rent`;
        const queryValue = [room_id];
        console.log(room_id)
        const result = await pool.query(queryStr, queryValue)
        if (!result) {
            return { status: 400, msg: 'Error get  bills data' };
        }

        return { status: 200, msg: result.rows };

    } catch (err) {
        console.log("ERROR AT PG QUERY - get all bills data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

const reqInsertBillsData = async (data, user_id) => {

    try {
        await pool.query("BEGIN")
        for (let i = 0; i < data.length; i++) {
            const { building, electric_lastmonth, electric_current, water_lastmonth, water_current, room_id, month_year } = data[i];


            const electric_used = electric_current - electric_lastmonth;
            const water_used = water_current - water_lastmonth;

            const queryStr = 'INSERT INTO bills(building, room_num, electric_lastmonth, electric_current, water_lastmonth, water_current, room_id, month_year, user_id,electric_used , water_used) VALUES ($1, (SELECT room_num FROM room WHERE room_id = $6 LIMIT 1), $2, $3, $4, $5, $6, $7, $8, $9, $10);'

            const queryValue = [building, electric_lastmonth, electric_current, water_lastmonth, water_current, room_id, month_year, user_id, electric_used, water_used]
            await pool.query(queryStr, queryValue)
        }
        await pool.query("COMMIT")
        return { status: 200, msg: 'Success Req update clean data' };

    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - Req insert fix data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

// for test
const reqUpdateTestData = async (month_year, index) => {
    try {
        const queryStr = 'UPDATE bills SET month_year = $1 WHERE index = $2;'
        const queryValue = [month_year, index]

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

const reqUpdateBillsData = async (data) => {
    try {
        
        const { index, room_id } = data

        const queryStr = 'UPDATE bills SET bills_state_id = 3 WHERE index = $1  AND room_id = $2  '
        const queryValue = [index, room_id]

        await pool.query("BEGIN")
        await pool.query(queryStr, queryValue)

        await pool.query("COMMIT")

        return { status: 200, msg: 'Success Req update bills data' };


    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - Req update bills data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }
}

module.exports = {
    getAllBillsData,
    getBillsData,
    reqUpdateTestData,
    reqUpdateBillsData,
    reqInsertBillsData
}