// //쿠키로 받는 미들웨어 만들다가 실패..

// const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser')
// const Users = require('./db/users')
// const jwtConfig = require('./jwt_config')
// cookieParser();

// module.exports = (req,res,next) => {
//     try{
//         const {user} = req.cookies;
//         const token = jwt.verify(user, jwtConfig.secretKey)
//         // console.log(user)
//         // console.log(token)
//         if (token) {
//             // console.log(token)
//             req.user = {
//                 userId : token.userId
//             }
//             return next()
//         }
//     } catch(error) {
//         console.error(error);
//         res.status(500).json({Message: "잘못된 접근입니다."});
//     }
// } 
