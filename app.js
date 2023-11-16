const express = require(`express`);
const router = express.Router();
const { io } = require(`./initial`);
const login = require(`./src/authen`)

io.on(`connection`, (socket) => {
    console.log("Connection from :" + socket.id);




socket.on(`get_all_pin_id`, async(data) => {
    const result = await login.checkRfid(data);
    socket.emit(`return_all_pin_id`,result);
});
});