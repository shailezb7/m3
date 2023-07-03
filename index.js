require('dotenv').config();
let express = require('express');
let cors = require('cors');
let { connectionDB } = require('./config/db');
let { Usermod } = require('./models/user.model');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let { auth } = require('./middlewares/authenticate');
let { Empmod } = require('./models/employee.model');
let {authorise} =require('./middlewares/authorisation');


let app = express();
app.use(express.json());
app.use(cors());



app.get('/', (req, res) => {
    res.send({ message: 'Landing Page' });
})

app.post('/signup', async (req, res) => {
    let { email, password } = req.body;
    let user = await Usermod.find({ email });

    if (user.length > 0) {
        res.send({ message: 'User already exist ! Please Login !' });
    }
    else {
        try {
            const hash_pass = bcrypt.hashSync(password, 8);
            await Usermod.create({ email, password: hash_pass });
            res.status(200).send({ message: 'Signup Successful!' });
        }
        catch (error) {
            //   console.log(error);
            res.status(500).send({ message: 'Error in Signup!' });
        }
    }
})

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await Usermod.findOne({ email });

    if (user) {
        try {
            let check_password = bcrypt.compareSync(password, user.password);
            if (check_password) {
                let token = jwt.sign({ empID: user._id }, process.env.SECRET_KEY);
                res.send({ message: 'Login successful !', token });
            }
            else {
                res.status(500).send({ message: 'Invalid Credentials' });
            }
        }
        catch (error) {
            // console.log(error);
            res.status(500).send({ message: 'Login failed !' });
        }
    }

    else {
        res.status(500).send('User not found. Please Signup First!');
    }

})



app.get('/employee', async (req,res)=>{
    try {
      let employees = await Empmod.find({empID:req.empID});
      res.status(200).send({data:employees});
    } 
    catch (error) {
      res.status(500).send({error:'Error getting employee data ! '})
    }
 })


app.post('/employee', auth, async (req, res) => {
    try {
        let { firstName, lastName, email, department, salary } = req.body;
        let user = await Usermod.findOne({ _id: req.empID });

        if (user) {
            await Empmod.create({ firstName, lastName, email, department, salary, empID: req.empID });
            res.status(200).send({ message: "Employee added successfully!" });
        }
        else {
            res._construct(400).send({ message: 'Invalid token!' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Employee addition failed!' })
    }
})

app.delete("/delete/employee/:empID", auth, authorise, async (req,res) => {
    let { empID } = req.params;

    try {
        let info = await Empmod.findOne({_id:empID});
        if(info){
            await Empmod.findByIdAndDelete({ _id: empID  })
            res.status(200).send({ message: "Employee deleted !" })
        }
        else{
            res.status(201).send({ message: "Employee data not found!" })
        }
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error while deleting!" })
    }
})


app.listen(process.env.PORT, () => {
    connectionDB();
    console.log(`Server running on ${process.env.PORT}`);
})