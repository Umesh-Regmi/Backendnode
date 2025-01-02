const User = require('../models/userModel')
const emailSender  = require('../utils/EmailSender')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const { token } = require('morgan')
const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')
const { error } = require('console')

// register
exports.register = async(req,res) => {
    let userExists = await User.findOne({email:req.body.email})
    if(userExists){
        return res.status(400).json({error:"Email already exists"})
    }
    userExists = await User.findOne({username:req.body.username})
    if(userExists){
        return res.status(400).json({error:"Username not available"})
    }
    let newUser = await User.create({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    })
    if(!newUser){
        return res.status(400).json({error:"Something went wrong"});
    }
    let token = await Token.create({
        token:crypto.randomBytes(16).toString('hex'),
        user:newUser._id
    })
    if(!token){
        return res.status(400).json({error:"Something went wrong"})
    }
    const url = `http://localhost:5000/verifyEmail/${token.token}`

    emailSender({
        from: "noreply@gmail.com",
        to: req.body.email,
        subject: "Verification email",
        text: "Please click on the given link to verify your account." +url,
        html: `<a href='${url}'><button>Click to verify</button></a>`
    })
    res.send(newUser)
}

// to verify email
exports.verifyEmail = async(req,res) =>{
    let token = await Token.findOne({token: req.params.token})
    if(!token){
        return res.status(400).json({error:"Invalid token or token may have expired"})
    }
    let user = await User.findById(token.user)
    if(!user){
        return res.status(400).json({error:"user not found"})
    }
    if(user.isVerified){
        return res.status(400).json({error:"User already verified. Login to continue."})
    }
    user.isVerified = true
    user = await user.save()
    if(!user){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send({message:"User verified successfully"})
    
}

// to forget password
exports.forgetPassword = async(req, res) => {
    // check email if exists or not
    let user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({error:"Email not registered"})
    }
    //generate token
    let token = await Token.create({
        user: user._id,
        token: crypto.randomBytes(16).toString('hex')
    })
    if(!token){
        return res.status(400).json({error:"Something went wrong"})
    }

    // send password reset link in email
    const url = `http://localhost:5000/resetPassword/${token.token}`
    emailSender({
        from: "noreplay@gmail.com",
        to: req.body.email,
        subject: "Passwor Reset Link",
        text: "Click on the following link to rest password " +url,
        html: `<a href = '${url}'><button>Reset password</button></a>`
    })
    res.send({message:"Password reset link has been sent to your email."})
}

// Reset password
exports.resetPassword = async(req, res) => {
    // check token is valid or not
    let token = await Token.findOne({token: req.params.token})
    if(!token){
        return res.status(400).json({error:"Token not available or token may have expired"})
    }
    // find user
    let user = await User.findById(token.user)
    if(!user){
        return res.status(400).json({error:"User not found"})
    }
    // reset password
    user.password = req.body.password
    user = await user.save()
    if(!user){
        return res.status(400).json({error:"Something went wrong"})
    }
    // sent message to user
    res.send({message:"Password changed successfully"})
}

// signin
exports.signin = async(req, res) => {
    const {email, password} = req.body
    // if email is registered
    let user = await User.findOne({email:email})
    if(!user){
        return res.status(400).json({error:"Email not registered"})
    }
    // if password is correct
    if(!user.authenticate(password)){
        return res.status(400).json({error:"Email and password do not match."})
    }

    // if user is verified or not
    if(!user.isVerified){
        return res.status(400).json({error:"User not verified"})
    }

    // generate login token
    let token = jwt.sign({
        user: user._id,
        email: user.email,
        role: user.role,
        username: user.username
    }, process.env.SECRET_KEY)

    if(!token){
        return res.status(400).json({error:"Something went wrong"})
    }
    // set info to cookies
    res.cookie('myCookie', token, {expire: Date.now() + 86400})

    const {_id, role, username} = user
    // send info to frontend
    res.send({token, user:{_id, email, role, username}})
}
// signout
exports.signOut = async(req, res) => {
    let response = await res.clearCookie('myCookie')
    if(!response){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.status({message:"Signed out successfully"})
}

 // Authorization
 exports.requireSignin = expressjwt({
    algorithms: ['HS256'],
    secret: process.env.SECRET_KEY
 })

// resent verification
exports.resentVerification = async(req, res) => {
    // Check if email already exists
    let user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({error:"Email not registered"})
    }
    // Check if password is correct
    if(!user.authenticate(req.body.password)){
        return res.status(400).json({error:"Password incorrect"})
    }
    //Check email if alredy verified
    if(user.isVerified){
        return res.status(400).json({error:"User already verified"})
    }
    // Generate token if email not verified
    let token = await Token.create({
        user:user._id,
        token:crypto.randomBytes(16).toString('hex')
    })
    if(!token){
        return res.status(400).json({error:"Something went wrong"})
    }

    // send token in email
    const url = `http://localhost:5000/resetPassword/${token.token}`
    emailSender({
        from: "noreplay@gmail.com",
        to: user.email,
        subject: "Verification Email",
        text: "Click on the following link to veriry email" +url,
        html: `<a href = '${url}'><button>Click to verify</button></a>`
    })
    res.send({message:"Verification link has been successfully send to your email"})
}