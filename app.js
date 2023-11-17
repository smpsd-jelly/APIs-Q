const express = require(`express`);
const router = express.Router();
const { io } = require(`./initial`);
const login = require(`./src/authen`)

io.on(`connection`, (socket) => {
    console.log("Connection from :" + socket.id);

    socket.on(`req_login_pin_or_rfid`, async(data) => {
        const result = await login.reqLoginUser(data);
        socket.emit(`res_login_pin_or_rfid`,result);
    });

});