const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'alumni') {
            return res.redirect('/alumni/dashboard');
        } else if (req.user.role === 'student') {
            return res.redirect('/student/dashboard');
        }
    }
    res.render('index', { title: 'Welcome to the Portal' });
});

module.exports = router;
