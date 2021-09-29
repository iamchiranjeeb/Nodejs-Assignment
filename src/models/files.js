const mongoose = require('mongoose');


const filesSchema = new mongoose.Schema({
  
    fileUrl:{
        type: String,
    },
    fileName:{
        type: String,
    },
    secretCode:{
        type:String,
        default:null
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Users"
    }
   
})

const MyFiles = mongoose.model('myFiles',filesSchema);

module.exports = MyFiles;

