const express = require('express');
const router = express.Router();
const { Server } = require('socket.io');

const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();

const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  host: dotenv.parsed.PG_HOST,
  user: dotenv.parsed.PG_USER,
  password: dotenv.parsed.PG_PASSWORD,
  database: dotenv.parsed.PG_DATABASE,
  port: dotenv.parsed.PG_PORT
});

const env = process.env.NODE_ENV;

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.json({ limit: '500mb', extended: true }));

const httpServer = http.createServer(app);

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
  console.log(`HTTP Server running on port: ${PORT}`);
});

const io = new Server(httpServer, {cors:{origin:'*'}})

module.exports = { io, pool };
