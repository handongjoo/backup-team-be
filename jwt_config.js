//jwt 생성값

module.exports = {
    secretKey : 'mykey', //  암호화 키
    options : {
        expiresIn : "30m", // 토큰 유효 기간
    }}