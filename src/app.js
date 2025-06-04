const express = require('express');
const { reqLoggerMiddleware } = require('./middlewares/loggerMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');
const routes = require('./routes');

const app = express();

app.use(reqLoggerMiddleware);
app.use(express.json());

app.use('/', routes);

app.use(errorMiddleware);

module.exports = app;
