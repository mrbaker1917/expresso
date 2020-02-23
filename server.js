const bodyParser = require('body-parser')
const cors = require('cors')
const errorhandler = require('errorhandler')
const morgan = require('morgan')
const express = require('express');
const app = express();

const PORT = process.env.PORT || 4000;

//middleware
app.use(bodyParser.json());
app.use(cors());
if (!process.env.IS_TEST_ENV) {
    app.use(morgan('dev'));
  };
app.use(errorhandler());

//import apiRouter
//const apiRouter = require('./api/api.js');
//app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});

module.exports = app;