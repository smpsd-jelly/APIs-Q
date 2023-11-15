const express = require('express');
const router = express.Router();
const { Server } = require("socket.io");

const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();

const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT
});

const env = process.env.NODE_ENV;

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({limit: '500mb', extended: true}));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.json({ limit: '500mb', extended: true }));

const httpServer = http.createServer(app);

const PORT = process.env.PORT;

const io = new Server(httpServer, { cors: {origin : '*'}});

httpServer.listen(PORT, () => {
  console.log(`HTTP Server running on port: ${PORT}`);
});

module.exports = { io, pool };
