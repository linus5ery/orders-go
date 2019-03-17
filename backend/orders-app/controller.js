

const path = require('path');
const request = require('request');
var Datastore = require('nedb');
var db = {};
db.orders = new Datastore(path.resolve(__dirname, './db/orders.db'));
db.items = new Datastore(path.resolve(__dirname, './db/items.db'));

//REQUEST FUNCTION - START
var self = module.exports = {

    getAllOrders : function (req, res, next) {
        db.orders.loadDatabase();
        db.orders.find({}, function (err, docs) {
            if(err) next(err);
            res.send(docs);
        });
    },

    getOrder : function (req, res, next) {
        var orderId = req.params.orderId;

        db.orders.loadDatabase();
        db.orders.findOne({_id: orderId}, function(err, doc) {
            if(doc == null) {
                res.send('Order id not found.');
            } else {
                res.send(doc);
            }
        });
    },

    getAllItems : function (req, res, next) {
        db.items.loadDatabase();
        db.items.find({}, function (err, docs) {
            if(err) next(err);
            res.send(docs);
        });
    },

    createOrder : function (req, res, next) {
        var cart = req.body.cart;

        if(!cart[0].itemId || !cart[0].qty) {
            res.send('Please fill in all required parameters.');
        }

        var query = [];
        for(var i in cart)
            query.push({_id: cart[i].itemId});
        var totalQty = 0;
        var totalAmount = 0;

        db.items.loadDatabase();
        db.items.find({$or: query}, function(err, docs) {
            if(docs.length <= 0) {
                res.send("Item id not found.");
            } else {
                for(var i in cart)
                    for(var j in docs) {
                        if(docs[j]._id == cart[i].itemId) {
                            totalQty += cart[i].qty;
                            totalAmount += docs[j].price * cart[i].qty;
                        }                                        
                    }               

                var order = {
                    cart: cart,
                    createdDate: new Date().toISOString(),
                    status: 'created',
                    totalQty: totalQty,
                    totalAmount: totalAmount,
                    isPaid: false
                };
                db.orders.loadDatabase();
                db.orders.insert(order, function(err, newDoc) {
                    if(err) next(err);            
                    res.send('Create order success.');
                });
            }
        });
    },

    cancelOrder : function (req, res, next) {
        var orderId = req.body.orderId;
        var event = req.body.event;
        if(!orderId) {
            if(event != 'payment') res.send('Please fill in all required parameters.');
            else req.params.code = -1;
        }
        
        db.orders.loadDatabase();
        db.orders.findOne({_id: orderId}, function(err, doc) {
            if(err) next(err);
            if(doc == null)
                if(event != 'payment') res.send('Order id not found.');
                else req.params.code = -1;
        });

        db.orders.remove({_id: orderId}, {}, function(err, numRemoved) {
            if(err) next(err);
            if(numRemoved > 0)
                if(event != 'payment') res.send('Cancel order success.');
                else req.params.code = 1;
        });
    },

    updateOrderStatus : function (req, res, next) {
        var orderId = req.body.orderId;
        var statusId = req.body.statusId;
        var event = req.body.event;
        var status;

        if(!orderId || !statusId) {
            res.send('Please fill in all required parameters.');
        }

        switch(statusId)
        {
            case '1': status = "created"; break;
            case '2': status = "processing"; break;
            case '3': status = "delivered"; break;
            default: 
            if(event != 'payment') res.send('Invalid status code.');
            else req.params.code = -1; 
            break;
        }
        
        db.orders.loadDatabase();
        db.orders.findOne({_id: orderId}, function(err, doc) {
            if(err) next(err);
            if(doc == null)
                if(event != 'payment') res.send('Order id not found.');
                else req.params.code = -1;
        });
        
        db.orders.update({_id: orderId}, {$set: {status: status}}, {}, function(err, numReplaced) {
            if(numReplaced > 0)
                if(event != 'payment') res.send('Update order status success.');
                else req.params.code = 1;
        });
    },

    payOrder : function (req, res, next) {
        var orderId = req.body.orderId;
        //Assume order system has user token for payment
        var userToken = "eb317c10-4580-11e9-89f5-630d3b592545";
        var paymentType = req.body.paymentType;

        if(!orderId || !paymentType) {
            res.send('Please fill in all required parameters.');
        }

        db.orders.loadDatabase();
        db.orders.findOne({_id: orderId}, function(err, doc) {
            if(doc == null) {
                res.send('Order id not found.');
            } else {
                var order = doc;
                if(order.isPaid) {
                    res.send("Order has paid.");
                } else {
                    //Process payment through payment-app (port: 3030) 
                    var options = {
                        url: 'http://localhost:3030/payments/pay/',
                        method: 'POST',
                        json: {
                            "userToken": userToken,
                            "paymentType": paymentType,
                            "totalQty": order.totalQty,
                            "totalAmount": order.totalAmount
                        },
                        headers: [
                            {
                              name: 'content-type',
                              value: 'application/json'
                            }
                          ],
                    };

                    request.post(options, function(error, response, body) {
                        if(response.statusCode != '200') {
                            res.send('Connect to payment service failed.');
                        } else {
                            req.body.event = 'payment';

                            if(body.code == -1) {                
                                self.cancelOrder(req, res, next);
                                res.send({
                                    code: -1,
                                    msg: 'Payment failed. Order has been cancelled.',
                                    processTimeInSec: 0
                                });                                        
                            } else {
                                req.body.statusId = '2';
                                self.updateOrderStatus(req, res, next);
                                db.orders.update({_id: orderId}, {$set: {isPaid: true}}, {}, function(err, numReplaced) {
                                    //if(numReplaced > 0)
                                        res.send({
                                            code: 1,
                                            msg: "Payment sucess. Order is processing for ",
                                            processTimeInSec: body.processTimeInSec
                                        });
                                }); 
                            }
                        }
                    });
                }
            }
        });
    },
}
//REQUEST FUNCTION - END
