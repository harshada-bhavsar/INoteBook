const express = require('express');
const router =  express.Router();
const User =    require('../models/User');
const{body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Harshuisagoodgir@l";

// ROUTE 1: create a User Using:POST "api/auth/createUser" , DOesn't reqquire auth no login required
router.post('/createuser' , [
    body('email','enter a valid email').isEmail(),
    body('name','enter a valid name').isLength({min:3}),
    body('password','enter a valid password').isLength({min:5}),
],async (req, res) =>{
    let success = false;
    // obj ={
    //     a:'this',
    //     number: 34
    // }

    //creating endpoints

    //if there are error return bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success, errors: errors.array()});
    }
    try{
   
    //check whether the user with this email  exists already
   let user = await User.findOne({email: req.body.email});
   if(user){
    return res.status(400).json({success, error:"sorry a user with this email is already exists"})
   }
   //generate salt
   const salt =  await  bcrypt.genSalt(10);
   const secPass =  await bcrypt.hash(req.body.password, salt);

    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
    })


    // .then(user => res.json(user))
    // .catch(err=>{ console.log(err)
    // res.json({error:"please enter a uniqur value for email", message: err.message})});
    const data = {
        user:{
            id : user.id
        }
    }
    const authtoken =  jwt.sign(data, JWT_SECRET);

    success = true;
    res.json({success, authtoken})
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal server Error")
    }
})

//ROUTE 2: Authentication a user using POST: "api/auth/login". No login required
router.post('/login' , [
    body('email','enter a valid email').isEmail(),
    // body('name','enter a valid name').isLength({min:3}),
    body('password','password cannot be blank').exists(),
],async (req, res) =>{
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success:false
            return res.status(400).json({success, error:"Please try to login with correct credentials"});
        }

        const data = {
            user:{
                id : user.id
            }
        }
        const authtoken =  jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error")
    }
})


//ROUTE 3: Get Loggedin user details using POST: "api/auth/getuser". login required
router.post('/getuser', fetchuser ,async (req, res) =>{
try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user);
} catch (error) {
    console.error(error.message);
           res.status(500).send("Internal server Error")
}
})  
module.exports = router