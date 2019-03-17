

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const order = require('./router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/orders', order);

const port = 3000;
app.listen(port, function () {
    console.log('Server started on port ' + port);
});