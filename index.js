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
    const numWorkers = 2;
        for (let i = 0; i < numWorkers; i++) {
            cluster.fork();
        }
   
}else{
    const app = express();
    app.use(cookieParser())
    app.use(cors({
        origin: 'https://rankmusic.vercel.app', // Frontend origin
        credentials: true,
}));
// app.use(cors({
//     origin: 'http://localhost:5173', // Frontend origin
//     credentials: true,
// }));
   //app.use(cors());
   conn(process.env.MONGODBURI)
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

// const express = require('express');
// const dotenv = require('dotenv');
// const cluster = require('node:cluster');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const morgan = require('morgan');
// const conn = require('./Connection');

// // Middleware and Routes
// const JwtAuth = require('./Middleware/JwtAuth');
// const router = require('./Routes/Signup');
// const routerforhome = require('./Routes/Home');
// const LoginRouter = require('./Routes/Login');
// const routerforlogout = require('./Routes/Logout');
// const routerforcookiecheck = require('./Routes/CookieCheck');
// const routeforpasswordrecovery = require('./Routes/PasswordRecovery');
// const routeforpasswordcodevalidation = require('./Routes/PasswordRecoveryCodeValidation');
// const routeforcreatenewpassword = require('./Routes/CreateNewPassword');

// dotenv.config();
// const PORT = process.env.PORT || '8001';

// if (cluster.isPrimary) {
//     try {
//         // Limit the number of worker processes to 2 (adjust based on server memory)
//         const numWorkers = 2;
//         for (let i = 0; i < numWorkers; i++) {
//             cluster.fork();
//         }
//     } catch (err) {
//         console.error('Error in forking cluster:', err);
//     }
// } else {
//     try {
//         const app = express();

//         // MongoDB Connection
//         console.log('Connecting to MongoDB...');
//         conn(process.env.MONGODBURI)
//             .then(() => console.log('MongoDB connected successfully'))
//             .catch(err => console.error('MongoDB connection error:', err));

//         // Middleware
//         app.use(cookieParser());
//         app.use(express.json());
//         app.use(cors({
//             origin: 'https://rankmusic.vercel.app', // Frontend origin
//             credentials: true,
//         }));
//         app.use(morgan('dev'));

//         // Routes
//         app.use('/Signup', router);
//         app.use('/home', JwtAuth, routerforhome);
//         app.use('/login', LoginRouter);
//         app.use('/logout', JwtAuth, routerforlogout);
//         app.use('/cookiecheck', routerforcookiecheck);
//         app.use('/passwordrecovery', routeforpasswordrecovery);
//         app.use('/passwordcodevalidation', routeforpasswordcodevalidation);
//         app.use('/createnewpassword', routeforcreatenewpassword);

//         // Start Server
//         app.listen(PORT, () => {
//             console.log('Listening to Identity Service on Port ' + PORT);
//         });
//     } catch (err) {
//         console.error('Error in setting up the server:', err);
//     }
// }
