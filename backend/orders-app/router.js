

const express = require('express');
const router = express.Router();

const order_controller = require('./controller');

router.get('/', function (req, res, next) {
    res.send('Orders home page');
});
router.get('/getAll', order_controller.getAllOrders);
router.get('/get/:orderId', order_controller.getOrder);
router.get('/getAllItems', order_controller.getAllItems);
router.post('/create', order_controller.createOrder);
router.delete('/cancel', order_controller.cancelOrder);
router.put('/updateStatus', order_controller.updateOrderStatus);
router.post('/pay', order_controller.payOrder);

module.exports = router;