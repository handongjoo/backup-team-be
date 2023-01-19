const jwt = require("jsonwebtoken");
const jwtConfig = require('../config/configuration');
const {getUserByEmailAndPassword, getUser, getMyProfile, getUsers} = require('../repository')

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await getUserByEmailAndPassword(email, password)
        if (!user) {
            res.status(400).send({message: "Not Found"})
            return
        } 
        const token = jwt.sign({userId : user.id}, jwtConfig.secretKey, jwtConfig.options);
        return res.cookie("user",token),
    
        res.status(200).json({message: "로그인 성공"})

    } catch (error) {
        res.status(500).send({message: error.message})
    }
}

const logout = async (req, res) => {
    return res.clearCookie('userId').send("로그아웃")
}

const findUser = async (req,res) => {
    try{
        const {id} = req.params
        const user = await getUser(id)
            if (!user) {
                res.status(400).json({message: "사용자가 없습니다."})
                return
            }
            return res.status(200).send(user)
        }    
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
}


const userList = async (req, res) => {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
  
    const userInfo = await getUsers(limit, offset)
  
    res.send({ userInfo, currentPage: page });
  }

const profileAndMyArticles = async (req, res) => {
    try{
        const {id} = req.params;

        const myProfile = await getMyProfile(id)

        if (myProfile) {
            res.status(200).json({myProfile})
        }
    }
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
}

module.exports = {login, findUser, userList, profileAndMyArticles, logout}