const { pool } = require('../initial');
const { io } = require('../initial'); 




const notification = async (noti_description, room_id) => {
    try {
        const queryStr = `INSERT INTO admin_notification(
            noti_description,room_id)
            VALUES ($1,$2);`
        const queryValue = [noti_description, room_id]


        await pool.query("BEGIN")
        await pool.query(queryStr, queryValue)
        await pool.query("COMMIT")
        io.sockets.emit('event_trigger');
        return { status: 200, msg: 'Success Req insert Slip data' };


    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - Req insert Slip data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }

}

// const insertroom = async () => {
//     try {
//         const queryStr = []
//         const queryValue = []

//         for(let room = 1101; room <= 1120; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 1])
//         }
//         for(let room = 1201; room <= 1220; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 1])
//         }
//         for(let room = 1301; room <= 1320; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 1])
//         }
//         for(let room = 1401; room <= 1420; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 1])
//         }
//         for(let room = 1501; room <= 1520; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 1])
//         }
//         for(let room = 2101; room <= 2120; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 2])
//         }
//         for(let room = 2201; room <= 2220; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 2])
//         }
//         for(let room = 2301; room <= 2320; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 2])
//         }
//         for(let room = 2401; room <= 2420; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 2])
//         }
//         for(let room = 2501; room <= 2520; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 2])
//         }
//         for(let room = 3101; room <= 3120; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 3])
//         }
//         for(let room = 3201; room <= 3220; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 3])
//         }
//         for(let room = 3301; room <= 3320; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 3])
//         }
//         for(let room = 3401; room <= 3420; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 3])
//         }
//         for(let room = 3501; room <= 3520; room++){
//             queryStr.push(`INSERT INTO room(room_num,building) VALUES ($1,$2);`)
//             queryValue.push([room, 3])
//         }
        

//         await pool.query("BEGIN")
//         for(let kuy= 0; kuy < queryStr.length; kuy++){
//             await pool.query(queryStr[kuy], queryValue[kuy])
//         }
//         await pool.query("COMMIT")
//         return { status: 200, msg: 'Success Req insert Slip data' };


//     } catch (err) {
//         await pool.query('ROLLBACK')
//         console.log("ERROR AT PG QUERY - Req insert Slip data");
//         console.log(err)
//         return { status: 500, msg: "INTERNAL ERROR" };
//     }

// }

const updateRead = async (noti_id) => {
    try {
        const queryStr = `UPDATE admin_notification SET read = true WHERE noti_id = $1;`
        const queryValue = [noti_id]


        await pool.query("BEGIN")
        await pool.query(queryStr, queryValue)
        await pool.query("COMMIT")
        io.sockets.emit('event_trigger');
        return { status: 200, msg: 'Success Req insert Slip data' };


    } catch (err) {
        await pool.query('ROLLBACK')
        console.log("ERROR AT PG QUERY - Req insert Slip data");
        console.log(err)
        return { status: 500, msg: "INTERNAL ERROR" };
    }

}

const getDataNoti = async () => {
   
        const queryStr = `
    SELECT admin_notification.*,room.room_num ,room.building  FROM admin_notification
    INNER JOIN room ON  admin_notification.room_id = room.room_id WHERE admin_notification.read = false
    ORDER BY admin_notification.read , admin_notification.noti_id DESC
      `;
        return await getPoolQuery(queryStr, 'getDataNoti');
}



const getPoolQuery = async (queryStr, funtions) => {
    try {
        return pool.query(queryStr)
            .then((result) => {
                if (result.rows.length < 1) {
                    return { status: 200, msg: [] }
                }
                return { status: 200, msg: result.rows }
            })
            .catch((error) => {
                console.log('Error Funtions ' + funtions + '() : ' + error);
                return { status: 201, msg: error }
            })
    }
    catch (error) {
        console.log('Error Connect : ' + error);
        return { status: 400, msg: error }
    }
}

module.exports = {
    notification,
    getDataNoti,
    updateRead,
    // insertroom
}