
const { io,app,router } = require('./initial')
const login = require(`./src/authen`)
const room = require('./src/room')
const clean = require('./src/clean')
const fix = require('./src/fix')
const bills = require('./src/bills')
const slip = require('./src/slip')
const noti = require('./src/noti')
const {uploadFile} = require('./src/uploadFile')
io.on(`connection`, (socket) => {
    console.log("Connection from :" + socket.id);

    socket.on(`req_login`, async (data) => {
        const result = await login.reqLoginUser(data);
        socket.emit(`res_login`, result);
    });
    socket.on(`req_register`, async (data) => {
        const result = await login.register(data);
        socket.emit(`res_register`, result);
    });


    socket.on(`get_room_data`, async () => {
        const result = await room.getRoomData();
        socket.emit(`room_data`, result);
    });
    socket.on(`get_all_room_data`, async () => {
        const result = await room.getAllRoomData();
        socket.emit(`all_room_data`, result);
    });

    socket.on(`get_all_clean_data`, async () => {
        const result = await clean.getAllCleanData();
        socket.emit(`all_clean_data`, result);
    });
    socket.on(`get_clean_data`, async (user_id,room_id) => {
        const result = await clean.getCleanData(user_id,room_id);
        socket.emit(`clean_data`, result);
    });
    socket.on(`req_insert_clean_data`, async (data) => {
        const result = await clean.reqInsertCleanData(data);
        socket.emit(`res_insert_clean_data`, result);
    });
    socket.on(`req_update_clean_data`, async (data) => {
        const result = await clean.reqUpdateCleanData(data);
        socket.emit(`res_update_clean_data`, result);
    });

    socket.on(`get_all_fix_data`, async () => {
        const result = await fix.getAllFixData();
        socket.emit(`all_fix_data`, result);
    });
    socket.on(`get_fix_data`, async (user_id,room_id) => {
        const result = await fix.getFixData(user_id,room_id);
        socket.emit(`fix_data`, result);
    });
    socket.on(`req_insert_fix_data`, async (data) => {
        const result = await fix.reqInsertFixData(data);
        socket.emit(`res_insert_fix_data`, result);
    });
    socket.on(`req_update_fix_data`, async (data) => {
        const result = await fix.reqUpdateFixData(data);
        socket.emit(`res_update_fix_data`, result);
    });

    socket.on(`get_all_bills_data`, async () => {
        const result = await bills.getAllBillsData();
        socket.emit(`all_bills_data`, result);
    });

    socket.on(`get_bills_data`, async (room_id) => {
        const result = await bills.getBillsData(room_id);
        socket.emit(`bills_data`, result);
    });

    socket.on(`req_update_bills_data`, async (data) => {
        const result = await bills.reqUpdateBillsData(data);
        socket.emit(`res_update_bills_data`, result);
    });

    //for test
    socket.on(`test1`, async (month_year,index) => {
        const result = await bills.reqUpdateTestData(month_year,index);
        socket.emit(`test2`, result);
    });
    
    socket.on(`req_uplode_imgae_data`, async (base64,fileName) => {
        const result = await uploadFile(base64,fileName);
        socket.emit(`res_uplode_imgae_data`, result);
    });


    socket.on(`get_all_slip_data`, async () => {
        const result = await slip.getAllSlipData();
        socket.emit(`all_slip_data`, result);
    });
    socket.on(`get_slip_data`, async (user_id, room_id) => {
        const result = await slip.getSlipData(user_id, room_id,);
        socket.emit(`slip_data`, result);
    });
    socket.on(`req_insert_slip_data`, async (data) => {
        const result = await slip.reqInsertSlipData(data);
        socket.emit(`res_insert_slip_data`, result);
    });
    socket.on(`req_update_slip_data`, async (data) => {
        const result = await slip.reqUpdateSlipData(data);
        socket.emit(`res_update_slip_data`, result);
    });
    socket.on(`insert_data_bills`, async (data,user_id) => {
        const result = await bills.reqInsertBillsData(data,user_id);
        socket.emit(`res_data_bills`, result);
    });
    socket.on(`update_password_data`, async (data) => {
        const result = await login.reqUpdatePasswordData(data);
        socket.emit(`res_password_data`, result);
    });




    socket.on(`get_data_noti`, async () => {
        const result = await noti.getDataNoti();
        socket.emit(`return_data_noti`, result);
    });

    socket.on(`update_read_noti`, async (noti_id) => {
        const result = await noti.updateRead(noti_id);
        socket.emit(`status_update_read_noti`, result);
    });

    socket.on(`get_all_user_data`, async () => {
        const result = await login.getAllUserData();
        socket.emit(`all_user_data`, result);
    });


});

app.get('/upload/:fileName', async (req,res) => {
    try {
        const fileName = req.params.fileName
        const path = __dirname + '/src/image/' + fileName;
        res.sendFile(path,(err) => {
            if(err){
                console.log('send file error');
                console.log(err);
                if(err.status === 404){
                    res.status(404).json({msg: 'file not found'});
                }
                res.end();
            }else{
                console.log('send file completed');
                res.end();
            }
        })
    } catch (error) {
        console.log(error)
    }
})
// app.use(router)
app.get('/', async (req,res) => {
    res.status(200).json('test')
})