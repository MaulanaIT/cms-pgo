// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var ClientModel = require('../../../../models/client');
var TransactionModel = require('../../../../models/transaction');
var QrisNotificationModel = require('../../../../models/qris_notification');
var PushNotificationModel = require('../../../../models/push_notification');
var hash = require('../../../../lib/helper/hash');

function save_log(order_id, nominal, request, response) {
    //Save the request to Log
    const log_request = new QrisNotificationModel({
        transaction_id: order_id,
        transaction_amount: nominal,
        transaction_type: 1,
        request: request,
        response: response
    });

    log_request.save();
}

async function push_notification(data, client_code, client_secret, client_notification_url) {
    //Save the push notification
    const notification = new PushNotificationModel({
        client_transaction_id: data.additional_field.client_transaction_id,
        transaction_amount: data.transaction_amount,
        client_notification_url: client_notification_url,
        signature: hash.generate_signature_pgo(data.additional_field.client_transaction_id, data.transaction_amount, client_code, client_secret),
        transaction_type: 1,
        request: data,
        try: 1
    });

    notification.save();

    const headers = {
        'signature-pgo': hash.generate_signature_pgo(data.additional_field.client_transaction_id, data.transaction_amount, client_code, client_secret),
        'Content-Type': 'application/json',
    }

    const response = await fetch(
        client_notification_url,
        {
            body: JSON.stringify(data),
            headers: headers,
            method: 'POST'
        }
    );

    notification.response_status_code = response.status;
    notification.save();
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const h_cid = req.headers['client-id'];
        const h_skey = req.headers['signature-key'];

        const signature = hash.generate_signature_yukk(req.body, yukk_secret);

        if (signature == h_skey) {
            const order_id = req.body.order_id;
            const nominal = req.body.nominal;
            const additional_field = req.body.additional_field;
            const rrn = req.body.rrn;
            const paid_by = req.body.paid_by;
            const payment_method = req.body.payment_method;
            const transaction_time = req.body.transaction_time;

            const request = {
                headers: {
                    cid: h_cid,
                    skey: h_skey
                },
                body: req.body
            }

            //Valid
            const docTransaction = await TransactionModel.findById(order_id).exec();
            if (docTransaction) {
                //Try Parse
                var obj_additional_field = {};

                if (additional_field == null || additional_field == "") {
                    return;
                } else {
                    try {
                        obj_additional_field = JSON.parse(additional_field);
                    } catch (e) {
                        obj_additional_field = additional_field;
                    }
                }

                //Get Client Detail
                const docClient = await ClientModel.findOne({
                    client_code: obj_additional_field.client_code
                }).exec();

                if (docClient) {
                    // var yukk_id = process.env.NEXT_PUBLIC_CLIENT_ID_STAGING;
                    var yukk_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET_STAGING;
                    var client_secret = null;
                    var client_code = obj_additional_field.client_code;
                    var client_notification_url = docClient.client_notification_url;

                    if (docClient.client_is_development == 1 && docClient.client_is_production == 0) {
                        //Staging
                        client_secret = docClient.client_secret_development;
                    } else if (docClient.client_is_development == 0 && docClient.client_is_production == 1) {
                        //Production
                        // yukk_id = docClient.client_qris_dynamic_mid;
                        yukk_secret = docClient.client_qris_dynamic_mid;
                        client_secret = docClient.client_secret_production;
                    }

                    if (docTransaction.transaction_status == 0) {
                        docTransaction.transaction_notification_response = "OK";
                        docTransaction.transaction_status = 1;
                        docTransaction.additional_field = obj_additional_field;
                        docTransaction.rrn = rrn;
                        docTransaction.paid_by = paid_by;
                        docTransaction.payment_method = payment_method;
                        docTransaction.transaction_time = transaction_time;
                        docTransaction.save();

                        save_log(order_id, nominal, request, docTransaction.transaction_notification_response);

                        res.status(200).send(docTransaction.transaction_notification_response);

                        push_notification(docTransaction, client_code, client_secret, client_notification_url);
                    } else if (docTransaction.transaction_status == 1) {
                        docTransaction.transaction_notification_response = "Transaction already paid";
                        docTransaction.additional_field = obj_additional_field;
                        docTransaction.rrn = rrn;
                        docTransaction.paid_by = paid_by;
                        docTransaction.payment_method = payment_method;
                        docTransaction.transaction_time = transaction_time;
                        docTransaction.save();

                        save_log(order_id, nominal, request, docTransaction.transaction_notification_response);

                        res.status(200).send(docTransaction.transaction_notification_response);

                        push_notification(docTransaction, client_code, client_secret, client_notification_url);
                    } else {
                        docTransaction.transaction_notification_response = "Transaction already processed";
                        docTransaction.additional_field = obj_additional_field;
                        docTransaction.rrn = rrn;
                        docTransaction.paid_by = paid_by;
                        docTransaction.payment_method = payment_method;
                        docTransaction.transaction_time = transaction_time;
                        docTransaction.save();

                        save_log(order_id, nominal, request, docTransaction.transaction_notification_response);

                        res.status(200).send(docTransaction.transaction_notification_response);

                        push_notification(docTransaction, client_code, client_secret, client_notification_url);
                    }
                } else {
                    res.status(400).json({
                        ok: 0, message: "Client Code Not Found"
                    });
                    return; //Stop The Code
                }
            } else {
                save_log(order_id, nominal, request, "Transaction : " + order_id + " Not Found");

                res.status(400).send("Transaction : " + order_id + " Not Found");
            }
        } else {
            res.status(400).send("Signature Not Matched");
        }
    } else {
        res.status(400).json({
            ok: 0, message: "Unauthorized"
        })
    }
}
