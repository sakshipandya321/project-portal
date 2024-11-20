const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const router = express.Router();
const Project = require('./models/Project');
const user = require('./models/User');

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Passport configuration
require('./config/passport')(passport);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global Variables for Flash Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // For passport errors
    next();
  });


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/alumni', require('./routes/alumni'));
app.use('/student', require('./routes/student'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


// // Ensure the user is an Alumni and logged in
// router.get('/alumni-dashboard', isAuthenticated, async (req, res) => {
//     if (req.user.role !== 'alumni') {
//         return res.redirect('/auth/login');
//     }

//     try {
//         // Get all students
//         const students = await User.find({ role: 'student' });
//         // Get projects assigned by this alumni
//         const projects = await Project.find({ assignedBy: req.user._id }).populate('assignedTo', 'username');

//         res.render('alumni-dashboard', {
//             user: req.user,
//             students: students,
//             projects: projects,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });

// // Route to assign project
// router.post('/alumni-dashboard', isAuthenticated, async (req, res) => {
//     if (req.user.role !== 'alumni') {
//         return res.redirect('/auth/login');
//     }

//     const { projectName, description, studentId } = req.body;

//     try {
//         // Create new project assignment
//         const newProject = new Project({
//             projectName,
//             description,
//             assignedTo: studentId,
//             assignedBy: req.user._id,
//         });

//         await newProject.save();
//         res.redirect('/alumni-dashboard');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });

// // Middleware to ensure user is authenticated
// function isAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         res.redirect('/auth/login');
//     }
// }

module.exports = router;