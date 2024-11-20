const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Middleware: Ensure user is authenticated and is a student
function isStudent(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'student') return next();
    res.redirect('/auth/login');
}

// Student Dashboard
router.get('/dashboard', isStudent, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id }).populate('assignedBy', 'username');
        console.log("tasks",tasks);
        res.render('student-dashboard', { user: req.user, tasks });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
