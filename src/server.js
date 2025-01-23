'use strict';

require('dotenv').config();
const express = require('express');
const handle400 = require('./errors/400');
const handle500 = require('./errors/500');
const jotterAuth = require('./jotter/auth/authRouter');
const jotter = require('./jotter/routes');
// const accessControl = require('./jotter/auth/middleware/accessControl');

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

// default route
app.get('/', (req, res) => res.status(200).send('default route is working'));

// app.use(accessControl); // CORS (only use for local testing)

// jotter routes
app.use('/jotter', jotterAuth);
app.use('/jotter/folder', jotter.folderRouter);
app.use('/jotter/note', jotter.noteRouter);
app.use('/jotter/config', jotter.configRouter);

// Handle errors
app.use(handle400);
app.use(handle500);

function start() {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

module.exports = { start, app };
