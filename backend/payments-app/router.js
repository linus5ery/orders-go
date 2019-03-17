

const express = require('express');
const router = express.Router();

const payment_controller = require('./controller');

router.get('/', function (req, res, next) {
    res.send('Payments home page');
});
router.get('/getAllServices', payment_controller.getAllServices);
router.get('/getService/:paymentType', payment_controller.getService);
router.post('/pay', payment_controller.pay);

module.exports = router;