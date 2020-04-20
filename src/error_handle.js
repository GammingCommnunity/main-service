module.exports ={
    ///
    onError: (err, messages, payload)=>{
        switch (err) {
            case "unAuth":
                return {
                    "status": 401,
                    "success": false,
                    "message": messages
                }
                break;
            case "fail":
                return {
                    "status": 400,
                    "success": false,
                    "message": messages
                }
            default:
                break;
        }
    },
    onSuccess: (messages,payload)=>{
        return {
            "status": 200,
            "success": true,
            "message": messages,
            "payload": payload
        }
    }
}