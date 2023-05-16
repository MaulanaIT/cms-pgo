// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var TransactionModel = require('../../../../models/transaction');

// var jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const _id = req.body._id;
        const editedBy = req.body.editedBy;
        const approve_manual_username = req.body.approve_manual_username;
        const approve_manual_transaction_id = req.body.approve_manual_transaction_id;

        //Get Client Detail
        const docTransaction = await TransactionModel.findById(_id).exec();

        if (docTransaction) {
            if(docTransaction.approve_manual_status == 0){
                docTransaction.approve_manual_username = approve_manual_username;
                docTransaction.approve_manual_transaction_id = approve_manual_transaction_id;
                docTransaction.approve_manual_status = 1;
                docTransaction.editedBy = editedBy;
                docTransaction.save();

                res.status(200).json({
                    ok: 1,
                    data: [],
                    message: 'Success Approve Manual',
                    timestamp: new Date().toString()
                });
            }else{
                res.status(200).json({
                    ok: 0,
                    data: [],
                    message: 'This Transaction Already Approved',
                    timestamp: new Date().toString()
                });
            }
        }else{
            res.status(200).json({
                ok: 0,
                data: [],
                message: 'Transaction Not Found',
                timestamp: new Date().toString()
            });
        }
    } else {
        res.status(200).json({
            ok: 0, message: "Unauthorized"
        })
    }
}
