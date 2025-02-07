
const jwt = require('jsonwebtoken')
const UserManager = require("../../Models/UserSchema")
const Encryptingpassword = require("../Encryption/Encrpytingpassword");
const handleSignup = async(req,res)=>{    
    if(req.body==null){
        return res.status(400).send('Please Input')         
    }
   
    const password = await Encryptingpassword(req.body.password)

     try{
        let userPayload = {
          
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            username: req.body.handle,
            password: password,
            role: req.body.role,
            bio: req.body.bio,
        };

        const CreatingUser = await UserManager.create(userPayload)

        const payload ={
            _id:CreatingUser._id,
            role:req.body.role,
        }
         const token = jwt.sign({payload},process.env.SECRET_KEY,{ expiresIn: '15m' })
         console.log(token)
         res.cookie('token', token, {
            httpOnly: true,
            secure: true,
             domain: ".up.railway.app",
            //sameSite:'Strict'
            sameSite: 'None',
            maxAge: 15*60*1000,
        });
        const userPayload2 ={
            id:CreatingUser?._id,
            name:CreatingUser?.name,
            role:CreatingUser?.role,
            avatar:CreatingUser?.avatar,
            handle:CreatingUser?.username,
            bio:CreatingUser?.bio,
            followers:CreatingUser?.followers?.length,
            following:CreatingUser?.following?.length,
    
        }
        res.status(200).send(userPayload2)
     }catch(error){
         if(error.code===11000){
            const field = Object.keys(error.keyValue)
            
            return res.status(400).send(field)
         }
     }
         
}


module.exports ={
    handleSignup
}
