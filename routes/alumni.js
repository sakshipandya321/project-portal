const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const router = express.Router();

// Middleware: Ensure user is authenticated and is an alumni
function isAlumni(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'alumni') return next();
    res.redirect('/auth/login');
}

// Alumni Dashboard
router.get('/dashboard', isAlumni, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedBy: req.user._id }).populate('assignedTo', 'username');
        const students = await User.find({ role: 'student' });
        res.render('alumni-dashboard', { user: req.user, tasks, students });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Create a Task
router.post('/dashboard', isAlumni, async (req, res) => {
    const { taskName, taskDescription, studentId } = req.body;
    try {
        const newTask = new Task({
            taskName,
            taskDescription,
            assignedTo: studentId,
            assignedBy: req.user._id
        });
        await newTask.save();
        req.flash('success_msg', 'Task created successfully!');
        res.redirect('/alumni/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to create task.');
        res.redirect('/alumni/dashboard');
    }
});

module.exports = router;
