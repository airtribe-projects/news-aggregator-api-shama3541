require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const axios = require('axios');
const User = require('../models/UserModel');

async function registerUser(req, res) { // Debugging log
    const username = req.body.name;
    const password = req.body.password
    const email=req.body.email;

    const preferences=req.body.preferences;
    if(!email){
        return res.status(400).send("Please enter email")
    }
    try{
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({name: username, password: hashedPassword,email:email,preferences:preferences});
        await newUser.save();
        return res.send('User registered successfully');
    }
    catch(err){
        console.log(err)
        return res.status(500).send('An error occurred');
    }
        
        
   
}

async function loginUser(req, res) {
    const email=req.body.email
    const password=req.body.password
    const Finduser=await User.findOne({email:email});
    if(!Finduser){
        return res.status(400).send('User not found');
    }
    const match = await bcrypt.compare(password, Finduser.password);
    if(match){
        const token = jwt.sign({email:email}, process.env.JWTSECRETKEY);
        return res.json({token:token});
    }
    else{
    return res.status(401).send('Invalid credentials');
    }
    
}

async function getUserPreferences(req, res) {
    const email = req.user.email;
    try{
       const Findpreference=await User.findOne({email:email});
         return res.json({preferences:Findpreference.preferences});
    }catch(err){
        console.log(err)
        return res.status(500).send('An error occurred');
    }
}

async function updateUserPreferences (req,res){
    const email= req.user.email;
    const newpreferences = req.body.preferences;
    
    try{
        const updateUserPreferences=await User.findOneAndUpdate({email:email},{preferences:newpreferences});
        return res.send('Preferences updated successfully');
}catch(err){
    console.log(err)
    return res.status(500).send('An error occurred');
}
}

async function getNews(req, res) {
    const email=req.user.email
    
  try{
    // const Findpreference=await User.findOne({username:user})
    // const preference=Findpreference.preference;
    const news = await axios.get(`https://newsapi.org/v2/everything?q=bitcoin&language=it&apiKey=${process.env.NEWSAPI_APIKEY}`)
    res.json({ news: news.data.articles })
  }catch{
    console.log(err)
    return res.status(500).send('An error occurred');
  }
}

module.exports = { registerUser,loginUser,getUserPreferences,updateUserPreferences,getNews };