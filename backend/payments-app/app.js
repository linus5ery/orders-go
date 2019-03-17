

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const payment = require('./router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/payments', payment);

const port = 3030;
app.listen(port, function () {
    console.log('Server started on port ' + port);
});