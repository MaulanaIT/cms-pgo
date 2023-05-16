// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var TransactionModel = require('../../../../models/transaction');
var ClientModel = require('../../../../models/client');
var QrisRequestModel = require('../../../../models/qris_request');
var hash = require('../../../../lib/helper/hash');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const nominal = parseInt(req.body.nominal);
        const order_id = req.body.order_id;
        const client_code = req.body.client_code;

        var additional_field = req.body.additional_field

        //Get Client Detail
        const docClient = await ClientModel.findOne({
            client_code: client_code
        }).exec();

        if (docClient) {
            //Check Signature
            const h_spgo = req.headers['signature-pgo'] || null;
            if ((docClient.client_is_development == 1 && docClient.client_is_production == 1) || (docClient.client_is_development == 0 && docClient.client_is_production == 0)) {
                res.status(200).json({
                    ok: 0, message: "Please set your client environment first"
                })
            } else {
                var yukk_id = process.env.NEXT_PUBLIC_CLIENT_ID_STAGING;
                var yukk_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET_STAGING;
                var client_secret = null;
                var is_production = false;
                if (docClient.client_is_development == 1 && docClient.client_is_production == 0) {
                    client_secret = docClient.client_secret_development;
                } else if (docClient.client_is_development == 0 && docClient.client_is_production == 1) {
                    yukk_id = docClient.client_qris_dynamic_mid;
                    yukk_secret = docClient.client_qris_dynamic_secret;
                    client_secret = docClient.client_secret_production;
                    is_production = true;
                }

                const signature_pgo = hash.generate_signature_pgo(order_id, nominal, client_code, client_secret);

                if (h_spgo == signature_pgo) {
                    //do simple validation
                    const doc = await TransactionModel.findOne({
                        client_code: client_code,
                        client_transaction_id: order_id
                    }).exec();

                    if (doc) {
                        res.status(200).json({
                            ok: 0, message: "This order id already exist"
                        })
                    } else {
                        if(additional_field == null || additional_field == ""){
                            additional_field = {
                                client_transaction_id: order_id,
                                client_code: docClient.client_code
                            };
                        }else{
                            try {
                                additional_field = JSON.parse(additional_field);

                                additional_field['client_transaction_id'] = order_id;
                            } catch (e) {
                                res.status(200).json({
                                    ok: 0,
                                    data: [],
                                    message: "Please use JSON object format in additional_field params"
                                })
                            }
                        }


                        //Add Transaction
                        const data = new TransactionModel({
                            client_code: client_code,
                            transaction_amount: nominal,
                            client_transaction_id: order_id,
                            transaction_type: 1,
                            additional_field: additional_field,
                            is_production: is_production
                        });

                        data.save();

                        //Request to QRIS
                        try {
                            const order_id_string = data._id.toString();
                            const body = {
                                nominal: nominal,
                                order_id: order_id_string,
                                additional_field: additional_field
                            }

                            const signature = hash.generate_signature_yukk(body, yukk_secret)

                            const headers = {
                                'client-id': yukk_id,
                                'signature-key': signature,
                                'Content-Type': 'application/json',
                            }

                            const response = await fetch(
                                process.env.NEXT_PUBLIC_ENDPOINT_URL + process.env.NEXT_PUBLIC_API_REQUEST_URL,
                                {
                                    body: JSON.stringify(body),
                                    headers: headers,
                                    method: 'POST'
                                }
                            );

                            const result = await response.json();

                            //Save the request to Log
                            const log_request = new QrisRequestModel({
                                client_code: client_code,
                                transaction_id: order_id_string,
                                transaction_amount: nominal,
                                client_transaction_id: order_id,
                                request: {
                                    headers: headers,
                                    body: body
                                },
                                response: result,
                                status: result.status_code
                            });

                            log_request.save();

                            if (result.status_code == 6000) {
                                res.status(200).json({
                                    ok: 1,
                                    data: result,
                                    message: "Success Insert Data"
                                })
                            } else {
                                //Delete Old data
                                TransactionModel.deleteOne({ _id: data._id }).exec();

                                res.status(200).json({
                                    ok: 0,
                                    data: result,
                                    message: "Failed Insert Data"
                                })
                            }
                        } catch (error) {
                            //Delete Old data
                            TransactionModel.deleteOne({ _id: data._id }).exec();

                            res.status(200).json({
                                ok: 0,
                                message: "Server Error"
                            })
                        }
                    }
                } else {
                    res.status(200).json({
                        ok: 0, message: "Signature Not Match"
                    })
                }
            }
        } else {
            res.status(200).json({
                ok: 0, message: "Client Code Not Found"
            })
        }
    } else {
        res.status(200).json({
            ok: 0, message: "Unauthorized"
        })
    }
}
