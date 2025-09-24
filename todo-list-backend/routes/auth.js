// routes/auth.js (Updated with Input Validation)

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator'); // Import validator functions
const User = require('../models/User');

const router = express.Router();

// --- SIGNUP ROUTE ---
// We add an array of validation rules as middleware
router.post(
    '/signup', 
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
    ], 
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();

            res.status(201).json({ message: 'User created successfully.' });
        } catch (error) {
            console.error('Signup Error:', error.message); // Log the specific error
            res.status(500).json({ message: 'Server error during signup.' });
        }
    }
);

// --- LOGIN ROUTE ---
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials.' }); // Use a generic message for security
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Invalid credentials.' }); // Use a generic message for security
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ token, userId: user._id });
        } catch (error) {
            console.error('Login Error:', error.message); // Log the specific error
            res.status(500).json({ message: 'Server error during login.' });
        }
    }
);

module.exports = router;