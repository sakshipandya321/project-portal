const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// Signup route
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
    const { username, password, role } = req.body;
  
    User.findOne({ username })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'User already exists');
          return res.redirect('/auth/signup');
        }
  
        const newUser = new User({ username, password, role });
  
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/auth/login');
              })
              .catch(err => console.log(err));
          });
        });
      })
      .catch(err => console.log(err));
  });

// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true, // Enables flash messages
    })(req, res, next);
  });
  

// Logout route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/auth/login');
  });
});

module.exports = router;
