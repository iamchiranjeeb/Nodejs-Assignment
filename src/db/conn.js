const mongoose = require('mongoose');

const connLink = "mongodb://127.0.0.1:27017/nodetest"

mongoose.connect(connLink,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>console.log("Connected Successfully ")).catch(e => console.log(`Error ${e.message}`))