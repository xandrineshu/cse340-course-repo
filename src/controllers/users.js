import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';
import { getProjectsByVolunteer } from '../models/volunteers.js';

// Middleware to protect routes that require authentication
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has the required role, continue
        next();
    };
};

const showUsersList = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.render('users', {
            title: 'Manage Users',
            users: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error', 'An error occurred while loading users.');
        res.redirect('/dashboard');
    }
};

// Controller to render the Dashboard page
const showDashboard = async (req, res, next) => {
    try {
        const user = req.session.user;
        const volunteeredProjects = await getProjectsByVolunteer(user.user_id);

        res.render('dashboard', {
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            role_name: user.role_name, // Pass role_name to EJS
            volunteeredProjects: volunteeredProjects || []
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        next(error);
    }
};

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            // Redirect to dashboard instead of home page
            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

export {
    requireLogin,
    showDashboard,
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireRole,
    showUsersList
};