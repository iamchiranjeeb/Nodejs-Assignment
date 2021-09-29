const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const hbs = require('hbs');
const {json} = require('express');
const cookieParser = require('cookie-parser');
const UserRouter = require('./routes/user');
const FileRouter = require('./routes/files');

dotenv.config();
require("./db/conn");

const app = express();
const PORT = process.env.PORT || 4005
const HOST = process.env.HOST || "127.0.0.1"
const connPath = path.join(__dirname,'../public');
const templatePath = path.join(__dirname,'../template/views');
const partialPath = path.join(__dirname,'../template/partials');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static(connPath));
app.set("view engine", 'hbs');
app.set("views", templatePath);
hbs.registerPartials(partialPath)
app.use(UserRouter);
app.use(FileRouter);
app.use("/usersfile", express.static("uploads/files"));


app.get("/",async(req, res)=>{
    res.status(200).render("index")
});

app.get("*",async (req, res)=>{
    try {
        res.status(404).render('404');
    } catch (error) {
        console.log(error.message);
    }
})

app.listen(PORT,HOST,()=>{
    console.log(`Server is up on ${HOST}:${PORT}`)
})