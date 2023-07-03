
let jwt = require('jsonwebtoken');

let auth=async (req,res,next) =>{
    let token= req.headers?.authorization.split(" ")[1];
    if(token){

        let dec= jwt.verify(token,process.env.SECRET_KEY);
        if(dec){
            req.empID=dec.empID;
          next();
        }

        else{
            res.send({message:'Token verification failed !'});
        }
    }

    else{
        res.status(400).send({message:'Please enter the token !'});
    }
}

module.exports={auth};