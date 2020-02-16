Login={
    generateToken : async(_,{username,pwd})=>{
        var token = sign({
            username:username,
            id_user:"123",
            role:"User"
        },process.env.SECRET_KEY,{expiresIn:"7d"});
        return token;
    },
}