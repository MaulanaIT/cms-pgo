const mongoose = require('mongoose');

//Log
const errorLog = require('../lib/winston/logger').errorlog;
const successLog = require('../lib/winston/logger').successlog;

var host = process.env.NEXT_PUBLIC_DB_HOST;
var additional_params;

if (host != 'localhost' && host != '0.0.0.0') {
    additional_params = {
        "authSource": process.env.NEXT_PUBLIC_DB_AUTHSOURCE,
        "user": process.env.NEXT_PUBLIC_DB_USERNAME,
        "pass": process.env.NEXT_PUBLIC_DB_PASSWORD
    }
}

var conn = mongoose.createConnection(
    "mongodb://" + process.env.NEXT_PUBLIC_DB_HOST + ":" + process.env.NEXT_PUBLIC_DB_PORT + "/" + process.env.NEXT_PUBLIC_DB_DATABASE,
    additional_params,
    function (error) {
        if (error) {
            errorLog.error(`DB Not Connected : ${error}`);
        } else {
            successLog.info("DB clients Connected at: " + process.env.NEXT_PUBLIC_DB_HOST + ":" + process.env.NEXT_PUBLIC_DB_PORT);
        }
    }
)

const qrisNotificationSchema = mongoose.Schema({
    transaction_id: {
        type: String,
        required: false
    },
    transaction_amount: {
        type: Number,
        required: false
    },
    transaction_type:{
        type: Number,
        required: false,
        default: 0
    },
    request: {
        type: Object,
        required: false
    },
    response: {
        type: Object,
        required: false
    }
},{timestamps: true});


module.exports = conn.model('qris_notification', qrisNotificationSchema);