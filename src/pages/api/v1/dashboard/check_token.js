// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var AdminModel = require('../../../../models/admin');

var jwt = require('jsonwebtoken');

export default async function handler(req, res){
    if (req.method === 'POST') {
        var token = req.body.token;

        if (!token){
            res.status(200).json({
                ok: 0,
                message: 'No token provided',
                timestamp: new Date().toString()
            });
        }
           
        jwt.verify(token, process.env.NEXT_PUBLIC_LOGIN_SECRET, async function (err, decoded) {
            if (err){
                res.status(200).json({
                    ok: 0,
                    message: 'Failed to authenticate token.',
                    timestamp: new Date().toString()
                });
            }else{
                const docAdmin = await AdminModel.findById(decoded.id).exec();

                if(docAdmin){
                    res.status(200).json({
                        ok: 1,
                        data: docAdmin,
                        message: 'Token Valid',
                        timestamp: new Date().toString()
                    });
                }
            }
        });
    } else {
        res.status(200).json({ 
            ok: 0, message: "Unauthorized" 
        })
    }
}
  