// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var PushNotificationModel = require('../../../../models/push_notification');


export default async function handler(req, res){
    if (req.method === 'GET') {
        var list = await PushNotificationModel.find({
            try: {$lt: 3},
            response_status_code: {$ne: 200}
        }).exec();

        var count_success = 0;
        var count_failed = 0;

        for(let row of list){
            const headers = {
                'signature-pgo': row.signature,
                'Content-Type': 'application/json',
            }
        
            const response = await fetch(
                row.client_notification_url,
                {
                    body: JSON.stringify(row.request),
                    headers: headers,
                    method: 'POST'
                }
            );
            
            row.try = row.try+1;
            row.response_status_code = response.status;
            row.save();

            if(response.status == 200){
                count_success++;
            }else{
                count_failed++;
            }
        }

        res.status(200).json({ 
            ok: 1,
            data: {
                success: count_success,
                failed: count_failed,
            },
            message: "Scheduler Run" 
        })
    } else {
        res.status(400).json({ 
            ok: 0, message: "Unauthorized" 
        })
    }
}
  