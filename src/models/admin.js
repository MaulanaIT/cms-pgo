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

const adminSchema = mongoose.Schema({
    client_code: {
        type: String,
        required: true
    },
    admin_username: {
        type: String,
        required: true
    },
    admin_password: {
        type: String,
        required: true
    },
    admin_name: {
        type: String,
        required: true
    },
    admin_email: {
        type: String,
        required: true
    },
    admin_status: {
        type: Number,
        required: true
    },
    admin_role_type: {
        type: Number,
        required: false
    },
    default_image: {
        type: String,
        required: false
    },
},{timestamps: true});


module.exports = conn.model('admin', adminSchema, 'admin');