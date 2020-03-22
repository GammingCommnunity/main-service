module.exports ={
    ///
    onError: (err,messages)=>{
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
    onSuccess: (messages)=>{
        return {
            "status": 200,
            "success": true,
            "message": messages
        }
    }
}