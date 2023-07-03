const { Empmod } = require("../models/employee.model");

let authorise=async (req,res,next)=>{
    let {empID}=req.params;

    let emp=await Empmod.findOne( {_id:empID} );
    let uzer=emp.empID;

    if(uzer==req.empID){
        next();
    }
    else{
        res.status(500).send({message:"User is not authorised! "})
    }
}

module.exports={
    authorise
}