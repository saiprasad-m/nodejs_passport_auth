const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User')



router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));



router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];

    // check required fields
    if(!name || !email || !password || !password2)
        errors.push({msg: 'Please fill in all fields'});
    
    if(password !== password2)
        errors.push({msg: 'Password do not match'});

    if(password.length < 6) 
        errors.push({msg: 'Password should be at least 6 characters'});

    if(errors.length > 0) {
        res.render('register',  {  
            errors,
            name,
            email,
            password,
            password2 
        })
    }
    else {
        // Validated user from body
        User.findOne({ email: email})
            .then( user => {
                if(user) {
                    errors.push({msg: 'Email is already registered'});

                    res.render('register',  {  
                        errors,
                        name,
                        email,
                        password,
                        password2 
                    })
                }
                else {
                    const newUser = new User({
                        name, email, password
                    });

                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    //console.log(user);
                                    req.flash('success_msg', 'You are now registered, please login.');                                    
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err))
                    }) )

                    //console.log(newUser);
                    //res.send('hello'+JSON.stringify(newUser))
                }
            })

    }
})

// Login API
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have succesfully logged out.');
    res.redirect('/users/login');
})

module.exports = router;