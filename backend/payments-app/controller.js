

const path = require('path');
var Datastore = require('nedb');
var db = {};
db.paymentServices = new Datastore(path.resolve(__dirname, './db/paymentServices.db'));

var self = module.exports = {

    getAllServices : function (req, res, next) {
        db.paymentServices.loadDatabase();
        db.paymentServices.find({}, function (err, docs) {
            if(err) next(err);
            res.send(docs);
        });      
    },

    getService : function (req, res, next) {
        var paymentType = req.params.paymentType;

        db.paymentServices.loadDatabase();
        db.paymentServices.findOne({type: paymentType}, function(err, doc) {
            if(doc == null) {
                res.send('Payment type not found.');
            } else {
                res.send(JSON.stringify(doc));
            }
        });
    },

    pay : function (req, res, next) {
        var userToken = req.body.userToken;
        var paymentType = req.body.paymentType;
        var totalQty = req.body.totalQty;
        var totalAmount = req.body.totalAmount;

        if(!userToken || !paymentType || !totalQty || !totalAmount) {
            res.send('Please fill in all required parameters.');
        }

        if(userToken != 'eb317c10-4580-11e9-89f5-630d3b592545') {
            res.send('Invalid user token');
        }

        db.paymentServices.findOne({type: paymentType}, function(err, doc) {
            if(doc == null) {
                res.send('Payment type not found');
            } else {
                var paymentService = doc;
                var isEnoughQty = totalQty >= paymentService.minItemQty ? true : false;
                var isEnoughAmount = totalAmount >= paymentService.minSpendAmount ? true : false;

                if(!isEnoughQty && !isEnoughAmount)
                    res.send({
                        code: -1,
                        msg: 'Total qty is less than ' + paymentService.minItemQty +
                                ' total amount is less than ' + paymentService.minSpendAmount + '.'
                    });
                else if(!isEnoughQty)
                    res.send({
                        code: -1,
                        msg: 'Total qty is less than ' + paymentService.minItemQty  + '.'
                    });
                else if(!isEnoughAmount)
                    res.send({
                        code: -1,
                        msg: 'Total amount is less than ' + paymentService.minSpendAmount + '.'
                    });
                else
                    res.send({
                        code: 1,
                        msg: 'Payment success.',
                        processTimeInSec: paymentService.processTimeInSec
                    });
            }
        });
    },    
};