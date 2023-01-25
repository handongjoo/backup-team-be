const jwt = require("jsonwebtoken");
const jwtConfig = require('../config/configuration');
const {getUserByEmailAndPassword, getUser, getMyProfile, getUsers, getMyArticles} = require('../repository')

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
    
        res.status(200).json({success: true})

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

        const user = req.cookies.user;
        const decoded = jwt.decode(user, jwtConfig.secretKey);
        const user_id = decoded.userId

        const myProfile = await getMyProfile(id)
        
        const myArticles = await getMyArticles(user_id)

        if (myProfile) {
            res.status(200).json({myProfile, myArticles})
        }
    }
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
}

module.exports = {login, findUser, userList, profileAndMyArticles, logout}