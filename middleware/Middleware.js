const jwt = require('jsonwebtoken')
const z =require('zod')
const User = require('../models/UserModel');
require('dotenv').config()

const userSchema = z.object({
    name: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    email: z.string().email("Invalid email format"),
    preferences: z.object({
      genre: z.array(z.string()),
      language: z.array(z.string())
    }).optional(),
  });

  function zodValidator(req, res, next) {
    const validationResult = userSchema.safeParse(req.body);
  
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.format() });
    }
  
    next();
  }
  
async function checkdbforexistinguser(req,res,next){
    const email=req.body.email;
    const Finduser=await User.findOne({email:email});
    if(Finduser){
        return res.status(400).send('User already exists!Please go to the login page');
    }
    next();
}


async function verifyJwt(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send('Token cannot be empty');
    }

    const token = authHeader.split(' ')[1];  
    if (!token) {
        return res.status(401).send('Token is missing');
    }

    try {
        const verified = jwt.verify(token, process.env.JWTSECRETKEY);
        req.user = verified;
        console.log(verified)
        next();
    } catch (err) {
        res.status(401).send('Invalid token');
    }

}

module.exports={verifyJwt,zodValidator,checkdbforexistinguser};