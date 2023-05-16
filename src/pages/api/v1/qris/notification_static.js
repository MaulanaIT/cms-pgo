// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var TransactionModel = require('../../../../models/transaction');
var QrisNotificationModel = require('../../../../models/qris_notification');
var hash = require('../../../../lib/helper/hash');

function save_log(order_id, nominal, request, response){
    //Save the request to Log
    const log_request = new QrisNotificationModel({
        transaction_id: order_id,
        transaction_amount: nominal,
        transaction_type: 2,
        request: request,
        response: response
    });

    log_request.save();
}

export default async function handler(req, res){
    if (req.method === 'POST') {
        const h_cid = req.headers['client-id'];
        const h_skey = req.headers['signature-key'];

        //Get Client Detail
        const docClient = await ClientModel.findOne({
            client_qris_static_mid: req.headers['client-id']
        }).exec();

        var yukk_id = process.env.NEXT_PUBLIC_CLIENT_ID_STAGING;
        var yukk_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET_STAGING;
        var is_production = false;

        if (docClient) {
            //Production
            yukk_id = docClient.client_qris_static_mid;
            yukk_secret = docClient.client_qris_static_mid;
            is_production = true;
        }else if(h_cid == yukk_id){
            //Staging Only
            
        }else {
            res.status(400).json({
                ok: 0, message: "Client Code Not Found"
            });
            return; //Stop The Code
        }

        const signature = hash.generate_signature_yukk(req.body, yukk_secret);
        
        if(signature == h_skey){
            const nominal = req.body.nominal;
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

            //Add Transaction
            const data = new TransactionModel({
                client_code: docClient.client_code,
                transaction_amount: nominal,
                client_transaction_id: null,
                transaction_type: 2,
                transaction_status: 1,
                rrn: rrn,
                paid_by: paid_by,
                payment_method: payment_method,
                transaction_time: transaction_time,
                transaction_notification_response: "OK",
                is_production: is_production
            });

            data.save();

            save_log(null, nominal, request, "OK");

            res.status(200).send("OK");
        }else{
            res.status(400).send("Signature Not Matched");
        }
    } else {
        res.status(400).json({ 
            ok: 0, message: "Unauthorized" 
        })
    }
}
  