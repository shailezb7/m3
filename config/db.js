let mongooz=require('mongoose');


let connectionDB = async ()=>{
   try {
       await mongooz.connect(process.env.MONGO_DB);
      console.log('Connected to the Database');
   } catch (error) {
      console.log('Error connecting to Atlas DB')
   }
}


 module.exports={connectionDB};