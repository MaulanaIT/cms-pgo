// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var TransactionModel = require('../../../../models/transaction');
var ClientModel = require('../../../../models/client');

// var jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const client_code = req.body.client_code;
        const current_page = req.body.current_page;
        const row_per_page = req.body.row_per_page;
        const search_tid = req.body.search_tid;

        //Get Client Detail
        const docClient = await ClientModel.findOne({
            client_code: client_code
        }).exec();

        if (docClient) {
            var filter = {};
            if (search_tid == null || search_tid == "") {
                filter = {
                    client_code: client_code
                }
            } else {
                filter = {
                    $and: [{
                        client_code: client_code,
                    }, {
                        $or: [{
                            client_transaction_id: {
                                $regex: search_tid,
                                $options: 'i'
                            }
                        }]
                    }]
                }
            }

            const countTransaction = await TransactionModel.find(filter)
                .countDocuments()
                .exec();
            const docsTransaction = await TransactionModel.find(filter)
                .sort({ _id: -1 })
                .limit(row_per_page * 1)
                .skip((current_page - 1) * row_per_page)
                .exec();

            if (docsTransaction.length > 0) {
                var total_transaction = 0;
                const sum = docsTransaction.reduce((partialSum, object) => {
                    if(object.transaction_status == 1){
                        total_transaction++;
                        return partialSum + object.transaction_amount
                    }else{
                        return partialSum + 0
                    }
                }, 0);

                res.status(200).json({
                    ok: 1,
                    data: docsTransaction,
                    total: {
                        sum: sum,
                        fee: sum * docClient.client_fee,
                        fee_percentage: docClient.client_fee,
                        total_transaction: total_transaction,
                    },
                    pagination: {
                        total_rows: countTransaction,
                        total_pages: Math.ceil(countTransaction / row_per_page),
                        current_page: current_page,
                    },
                    message: 'Transactions Found',
                    timestamp: new Date().toString()
                });
            } else {
                res.status(200).json({
                    ok: 1,
                    data: [],
                    pagination: {
                        total_rows: null,
                        total_pages: null,
                        current_page: current_page,
                    },
                    message: 'Transaction Not Found or Final Page',
                    timestamp: new Date().toString()
                });
            }
        }else{
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
