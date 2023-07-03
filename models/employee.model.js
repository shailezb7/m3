let mongoose = require('mongoose');

let empSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },

    lastName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    department:{
        type:String,
        required:true,
        enum:["Tech", "Marketing", "Operations"],
        default:"Tech"
    },

    salary:{
        type:Number,
        required:true
    },

    empID:{
        type:String
    }

})

 let Empmod = mongoose.model('employee',empSchema);

 module.exports={Empmod};