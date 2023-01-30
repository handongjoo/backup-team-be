const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require('./src/routes/user.routes')
const articleRouter = require('./src/routes/article.routes') 
const tagRouter = require('./src/routes/tag.routes')

const corsOptions = {
    origin: true,
    credentials: true
};

const app = express();
const port = 3000;

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/', [userRouter, articleRouter, tagRouter])

app.listen(port, () => {
    console.log("서버 오픈");
});