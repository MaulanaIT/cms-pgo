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

const transactionSchema = mongoose.Schema({
    client_code: {
        type: String,
        required: false,
        index: true
    },
    client_transaction_id: {
        type: String,
        required: false,
        index: true
    },
    transaction_amount: {
        type: Number,
        required: false
    },
    transaction_type: { //1 = QRIS DYNAMIC, //2 = QRIS STATIS
        type: Number,
        required: false
    },
    additional_field: {
        type: Object,
        required: false
    },
    transaction_status: {
        type: Number,
        required: false,
        default: 0
    },
    transaction_settlement_status: {
        type: Number,
        required: false,
        default: 0
    },
    transaction_settlement_date: {
        type: String,
        required: false
    },
    transaction_settlement_amount: {
        type: Number,
        required: false
    },
    transaction_notification_response: {
        type: String,
        required: false
    },
    rrn: {
        type: String,
        required: false,
        index: true
    },
    paid_by: {
        type: String,
        required: false
    },
    payment_method: {
        type: String,
        required: false
    },
    transaction_time: {
        type: String,
        required: false
    },
    approve_manual_username:{
        type: String,
        required: false
    },
    approve_manual_transaction_id:{
        type: String,
        required: false
    },
    approve_manual_status:{
        type: Number,
        required: false,
        default: 0
    },
    is_production: {
        type: Boolean,
        default: 0
    },
    createdBy:{
        type: String,
        required: false
    },
    editedBy:{
        type: String,
        required: false
    }
},{timestamps: true});


module.exports = conn.model('transaction', transactionSchema);