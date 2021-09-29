const User = require("../models/user");
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');


exports.getSignupPage = async(req, res)=>{
    res.status(200).render('register');
}

exports.userSignup = async (req, res) =>{
    try {
        const {fullName,email,username,gender,password,confirmPassword} = req.body
        if(!fullName || !email || !username || !password || !confirmPassword){
            return res.status(400).render('register',{error:"All Fields are required"})
        }

        const findUserEmail = await User.findOne({email: email});
        const findUserName = await User.findOne({username: username});

        if (findUserEmail){
            return res.status(400).render('register',{error:"This Email already exists"});
        }

        if(findUserName){
            return res.status(400).render('register',{error:"This User Name Already Taken"})
        }

        if(password === confirmPassword) {
            const newUser = new User(req.body)
            const registeredUser = await newUser.save();

            return res.status(200).render('register',{message:"You are registered."})
        }else{
            return res.status(400).render('register',{error:"Password Not Mathcing"})
        }

        
    } catch (e) {
        res.status(400).render('register',{error:e.message})
    }
}


exports.getLoginPage = async(req, res)=>{
    res.status(200).render('login');
}


exports.userLogin = async(req, res)=>{
    try {

        const {username, password} = req.body

        const findUser = await User.findOne({username})

        if(!findUser){
            return res.status(404).render('login',{error:"User not found"})
        }

        const isMatch = await bcrypt.compare(password,findUser.password)
        const token = await findUser.generateAuthToken()

        if(isMatch) {
            res.cookie("jwt",token)
            return res.status(200).redirect("/user")
        }else{
            return res.status(404).render('login',{error:"Invalid Credentials"})
        }
        
    } catch (e) {
        res.status(500).render('login',{error:e.message});
    }
}


exports.getUserDetails = async(req, res)=>{
    try {
        res.status(200).render('details',{
            fullName:req.user.fullName,
            email:req.user.email,
            userName:req.user.username,
            gender: req.user.gender,
        })
    } catch (e) {
        res.status(500).render('details',{ error: e.message})
    }
}



exports.getUserUpdateDetailsPage = async(req, res)=>{
    try {
        res.status(200).render('userdetailsupdate',{
            fullName:req.user.fullName,
            email:req.user.email,
            userName:req.user.username,
            gender: req.user.gender,
        })
    } catch (e) {
        res.status(500).render('userdetailsupdate',{ error: e.message})
    }
}

exports.updateUserDetails = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["fullName","email","username","gender"];
    const isValidOperation = updates.every((update)=>allowUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).render('userdetailsupdate',{error:"Invalid Operation"});
    }
    try {

        updates.forEach((update)=> req.user[update]=req.body[update])
        await req.user.save();
        res.status(200).redirect('/user')
    } catch (e) {
        
        res.status(500).render('userdetailsupdate',{error:e.message});
    }
}


exports.getPasswordUpdatePage = async (req, res)=>{
    res.status(200).render('updatepassword')
}


exports.updatePassword = async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowUpdates = ["password","confirmPassword"];
    const isValidOperation = updates.every((update) => allowUpdates.includes(update));
    if(!isValidOperation){
        return res.status(200).render('updatepassword',{error:"Invalid Operation"})

    }

    try {
        if(req.body.password !== req.body.confirmPassword){
            return res.status(200).render('updatepassword',{error:"Password not Mathcing"})
        }
        updates.forEach((update) => req.user[update]=req.body[update])
        await req.user.save();
        res.status(200).redirect("/user")
    } catch (e) {
        res.status(200).render('updatepassword',{error:e.message})
    }
}


exports.deleteUser = async(req, res)=>{
    try {
        const findUser = await User.findOne({_id:req.user.id})
        if(!findUser) {
            res.status(500).render('details',{ error: "User Not Found" })
        }
        res.clearCookie('jwt');
        findUser.remove();
        res.status(200).redirect('/');
    } catch (e) {
        res.status(500).render('details',{ error: e.message})
    }
}


exports.logOut = async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((currElement)=>{
            return currElement.token !== req.token
        });
        res.clearCookie('jwt');
        await req.user.save();
        res.status(200).redirect('/');
    } catch (e) {
        res.status(500).render('details',{ error: e.message})
    }
}



exports.logOutAll = async(req, res)=>{
    try{
        req.user.tokens = [];
        res.clearCookie('jwt');
        await req.user.save()
        res.status(200).redirect('/');
    }catch (e){
        res.status(500).render('details',{ error: e.message})
    }
}