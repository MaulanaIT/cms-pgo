// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var AdminModel = require('../../../../models/admin');
var ClientModel = require('../../../../models/client');
var hash = require('../../../../lib/helper/hash');

var jwt = require('jsonwebtoken');

export default async function handler(req, res){
    if (req.method === 'POST') {
        const admin_email = req.body.admin_email.trim().toLowerCase();
        const admin_password = req.body.admin_password;
    
        const docAdmin = await AdminModel.findOne({
            admin_email: admin_email,
            admin_password: hash.hash_dynamic(admin_password)
        }, "_id client_code admin_username admin_name admin_email admin_image admin_status admin_role_type").exec();

        if (docAdmin) {
            if(docAdmin.admin_status == 1){
                const docClient = await ClientModel.findOne({
                    client_code: docAdmin.client_code
                }).exec();
    
                if(docClient){
                    if(docAdmin.admin_status == 1){
                        var token = jwt.sign({
                            id: docAdmin._id,
                            client_detail: docClient.client_code
                        }, process.env.NEXT_PUBLIC_LOGIN_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
        
                        var client = {
                            _id: docClient._id,
                            client_code: docClient.client_code,
                            client_name: docClient.client_name,
                            client_fee: docClient.client_fee,
                            client_logo: docClient.client_logo,
                            client_is_development: docClient.client_is_development,
                            client_is_production: docClient.client_is_production,
                            client_secret_development: docClient.client_secret_development,
                            client_secret_production: docClient.client_secret_production,
                            client_status: docClient.client_status,
                            client_qris_dynamic_mid: hash.encrypt(docClient.client_qris_dynamic_mid),
                            client_qris_dynamic_secret: hash.encrypt(docClient.client_qris_dynamic_secret),
                            client_qris_static_mid: hash.encrypt(docClient.client_qris_static_mid),
                            client_qris_static_secret: hash.encrypt(docClient.client_qris_static_secret),
                        }
        
                        res.status(200).json({
                            ok: 1,
                            data: {
                                admin: docAdmin,
                                client: client
                            },
                            token: token,
                            message: 'Success Retrieve Data',
                            timestamp: new Date().toString()
                        });
                    }else{
                        res.status(200).json({
                            ok: 0,
                            data: [],
                            message: 'This Merchant is no longer active, Please Contact Administrator',
                            timestamp: new Date().toString()
                        });
                    }
                }else {
                    res.status(200).json({
                        ok: 0,
                        data: [],
                        message: 'Client Not Found',
                        timestamp: new Date().toString()
                    });
                }
            }else{
                res.status(200).json({
                    ok: 0,
                    data: [],
                    message: 'You Are Banned, Please Contact Administrator',
                    timestamp: new Date().toString()
                });
            }
        } else {
            res.status(200).json({
                ok: 0,
                data: [],
                message: 'Invalid Email & Password',
                timestamp: new Date().toString()
            });
        }
    } else {
        res.status(200).json({ 
            ok: 0, message: "Unauthorized" 
        })
    }
}
  