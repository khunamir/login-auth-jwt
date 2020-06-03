const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');

// register
router.post('/register', async (req,res) => {

    // validate user registration
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // find if email already exist
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    // save user to database
    await user.save((err, doc) => {
        if (err) throw (err);
        console.log(mongoose.connection.readyState);
    });

    // send back user id to server
    res.send({user: user._id});
});

// login
router.post('/login', async (req,res) => {
    
    // validate user registration
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // find if email already exist
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is not found/registered');

    // password validation
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Inavlid password');

    // create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;