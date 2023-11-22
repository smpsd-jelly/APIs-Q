const express = require(`express`);
const router = express.Router();
const { io } = require('./initial')
const login = require(`./src/authen`)
const room = require('./src/room')
const clean = require('./src/clean')
const fix = require('./src/fix')

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

    socket.on(`get_all_clean_data`, async () => {
        const result = await clean.getAllCleanData();
        socket.emit(`all_clean_data`, result);
    });
    socket.on(`get_clean_data`, async (user_id) => {
        const result = await clean.getCleanData(user_id);
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
    socket.on(`get_fix_data`, async (user_id) => {
        const result = await fix.getFixData(user_id);
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
});