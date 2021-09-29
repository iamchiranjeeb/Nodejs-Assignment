const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Files = require('./files');


const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Not a Valid Email");
            }
        }
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    gender:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
        validate(val) {
            let lowerCase = /[a-z]/g;
            let upperCase = /[A-Z]/g;
            let specialCharacter = /[!@#$%?/\|:;~`^&*]/;
            let number = /[0-9]/g;
            if (val.length < 8) {
                throw new Error("Password Length Should be greater than or equal to 8.")
            } else if (!val.match(lowerCase)) {
                throw new Error("Password Should Include a Lower Case.")
            } else if (!val.match(upperCase)) {
                throw new Error("Password should Include an Upper Case.")
            } else if (!val.match(number)) {
                throw new Error("Password should include a Number.")
            } else if (!val.match(specialCharacter)) {
                throw new Error("Password should include a special Character")
            } else {
                return true;
            }
        }

    },
    confirmPassword:{
        type: String,
        required: true,
    },
    //Here tokens is array of an object
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
   
},{timestamps:true})



//Generating Token
UserSchema.methods.generateAuthToken = async function (){
    const user = this
    try{
        const genToken = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
        user.tokens = user.tokens.concat({token: genToken})
        await user.save()
        return genToken
    }catch(e){
        console.log(e.message)
    }
}


//Hashing the Password
UserSchema.pre("save", async function (next){
   
    const user = this
    if (user.isModified("password")){
        
        user.password = await bcrypt.hash(user.password,10);
        user.confirmPassword = await bcrypt.hash(user.confirmPassword,10);
        
    }
    next();
})

//Delete Files when user is removed
UserSchema.pre("remove", async function(next){
    const user = this
    await Files.deleteMany({owner:user._id});
    next();
})




const UserRegister = new mongoose.model("Users",UserSchema)
module.exports = UserRegister;

