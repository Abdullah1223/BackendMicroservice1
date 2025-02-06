const express = require('express')
const dotenv = require('dotenv')
const numcpus = require('node:os').availableParallelism()
const cluster = require('node:cluster')
const JwtAuth=require('./Middleware/JwtAuth')
const router  = require('./Routes/Signup')
const cors = require('cors')
const conn = require('./Connection')
const cookieParser = require('cookie-parser')
const routerforhome = require('./Routes/Home')
const LoginRouter = require('./Routes/Login')
const routerforlogout = require('./Routes/Logout')
const routerforcookiecheck = require('./Routes/CookieCheck')
const routeforpasswordrecovery = require('./Routes/PasswordRecovery')
const routeforpasswordcodevalidation = require('./Routes/PasswordRecoveryCodeValidation')
const routeforcreatenewpassword = require('./Routes/CreateNewPassword')
const morgan = require('morgan')
dotenv.config()
const PORT = process.env.PORT ||'8001';


if(cluster.isPrimary){
   for(i=0;numcpus>i;i++){
    cluster.fork();
   }
   
}else{
    const app = express();
    app.use(cookieParser())
    app.use(cors({
        origin: `${process.env.ORIGINURL}`, // Frontend origin
        credentials: true,
}));
// app.use(cors({
//     origin: 'http://localhost:5173', // Frontend origin
//     credentials: true,
// }));
 
   conn('mongodb://localhost:27017/MusicApp')
   app.use(express.json())

   app.use(morgan('dev'))
    app.use('/Signup',router)
    app.use('/home',JwtAuth,routerforhome )
    app.use('/login',LoginRouter)
    app.use('/logout',JwtAuth,routerforlogout)
    app.use('/cookiecheck',routerforcookiecheck)
    app.use('/passwordrecovery',routeforpasswordrecovery)
    app.use('/passwordcodevalidation',routeforpasswordcodevalidation)
    app.use('/createnewpassword',routeforcreatenewpassword)
    app.listen(PORT,()=>{console.log('Listening to Identity Service On Port Number '+PORT)})
}
