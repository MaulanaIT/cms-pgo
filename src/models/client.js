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

const clientSchema = mongoose.Schema({
    client_code: {
        type: String,
        required: false
    },
    client_name: {
        type: String,
        required: false
    },
    client_ip_whitelist: {
        type: String,
        required: false
    },
    client_fee: {
        type: Number,
        required: false
    },
    client_is_development: {
        type: Boolean,
        default: true
    },
    client_is_production: {
        type: Boolean,
        default: false
    },
    client_secret_development: {
        type: String,
        required: false
    },
    client_secret_production: {
        type: String,
        required: false
    },
    client_qris_dynamic_mid: {
        type: String,
        required: false
    },
    client_qris_dynamic_secret: {
        type: String,
        required: false
    },
    client_qris_static_mid: {
        type: String,
        required: false
    },
    client_qris_static_secret: {
        type: String,
        required: false
    },
    client_logo: {
        type: String,
        required: true,
        default: "default_image.png"
    },
    client_notification_url:{
        type: String,
        required: false
    },
    client_status: {
        type: Number,
        required: true
    },
},{timestamps: true});


module.exports = conn.model('client', clientSchema);