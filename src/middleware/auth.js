const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) =>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.JWT_SECRET);
        console.log(verifyUser);
        const user = await User.findOne({_id:verifyUser._id});
        console.log(user.email);
        req.token = token;
        req.user = user;
        next();
    }catch(err){
        res.status(401).send(err.message)
    }
}



// const auth = async(req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '')
//         const decode = jwt.verify(token, process.env.JWT_SECRET)
//         const user = await User.findOne({ _id: decode._id, 'tokens.token': token })
//         if (!user) {
//             throw new Error("Please Login ")
//         }
//         req.token = token
//         req.user = user
//         next()

//     } catch (e) {
//         res.status(401).send(e.message)
//     }
// }


module.exports = auth;
