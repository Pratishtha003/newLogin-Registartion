const express = require("express");
const app = express();
const port = process.env.PORT || 3000;//port so we can host our website globaly else on host 3000
const mongoose = require("mongoose");
const userdata = require('./src/models/form')
const path = require("path");
const hbs = require("hbs");
// app.use(express.json());  //middleware
const Register = require('./src/models/form')
const bcrypt = require('bcrypt');

const uri = "mongodb+srv://pratishtha1057:prati.KHU987_654@cluster0.nfnmmng.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri,{
    // useNewurlParser:true,
    // useUnifiedTopology:true
    // useCreateIndex:true
}).then(()=> console.log(`Database connect`))
.catch(() => console.log(`Error`));


const static_path = path.join(__dirname,"./src/models");
const template_path = path.join(__dirname,"./templates/views");
const partials_path = path.join(__dirname,"./templates/partials");

app.use(express.static(static_path));
// app.use(express.static('navbar'));
console.log(path.join(__dirname,"./template/views"));


app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.use(express.json());//middleawre
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/register",(req,res)=>{
    res.render("register");
})


app.post("/register", async (req,res)=>{
    try{
        // console.log(req.body.firstName);
        // res.send(req.body.firstName);
        const password = req.body.password;
        const cpassword = req.body.confirmPassword;
        const hashedPassword = await bcrypt.hash(req.body.password,3);
        if(password===cpassword){
            const registerEmloyee = new Register({
                firstname : req.body.firstName,
                lastname : req.body.lastName,
                email : req.body.email,
                password : hashedPassword,
                confirmpassword : req.body.confirmPassword,
                phone : req.body.phoneNumber,
                gender : req.body.gender
            })
            // res.redirect("./login.hbs");
            const registered = await registerEmloyee.save();
            res.status(201).render("login");
        }else{
            res.send("password wrong");
        }
    }catch(error){
        res.status(400).send(error);
    }
})


app.get("/views/login.hbs",(req,res)=>{
    res.render("login");
})

app.post("/login", async (req, res) => {
    try{
        const check = await Register.findOne({email:req.body.username});
        if(!check){
            res.send("user name not found");
        }
        const isPass = await bcrypt.compare(req.body.password, check.password);
        
        if(isPass){
            res.render("index")  
        }else{
            res.send("Wrong");
        }
    }
    catch{
        res.send("Wrong details");
    }
});

app.get("/change",(req,res)=>{
    res.render("change");
})


// Add this route in your Express application
app.post("/change", async (req, res) => {
    try {
        // const userEmail = req.body.email; 
        const firstName1 = req.body.firstNamename;
        const lastName1 = req.body.Namename;
        const email1 = req.body.email;
        const password1 = req.body.password;
        const confirmPassword1 = req.body.confirmPassword;
        const phoneNumber1 = req.body.phoneNumber;
        
        const updatedUser = await Register.updateOne({ email: email1 },
            {
                $set: {
                    firstname: req.body.firstName,
                    lastname: req.body.lastName,
                    phone: req.body.phoneNumber
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.render("index"); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/delete",(req,res)=>{
    res.render("delete");
})

app.post("/delete", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if(password===confirmPassword){
            // const deletedUser = await Register.deleteOne({email:email});
            try {
                const deletedUser = await Register.deleteOne({ email: email });
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
        // if (!deletedUser) {
        //     return res.status(404).send("User not found");
        // }

        res.render("index"); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
})