const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const jwtConfig = require('./configuration')
cookieParser();

module.exports = (req,res,next) => {
    try{
        if (!req.cookies || !req.cookies.user) {
            return res.status(400).send({message: "로그인 후 사용 가능한 api"})
        }
        const user = req.cookies.user;
        console.log(user)
        const token = jwt.verify(user, jwtConfig.secretKey)
        if (token) {
            return next();
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({Message: "잘못된 접근입니다."});
    }
} 
