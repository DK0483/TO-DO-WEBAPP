// server.js (Updated with Authentication)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Import your new routes and models
const authRoutes = require('./routes/auth'); 
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully! ✅'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Routes ---
// Use the new authentication routes for signup and login
app.use('/api/auth', authRoutes); 

// --- Authentication Middleware ---
// This function will protect our task routes
const authMiddleware = (req, res, next) => {
    // Get token from the 'Authorization' header (e.g., "Bearer YOUR_TOKEN")
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the user's ID from the token to the request object
        req.user = { userId: decoded.userId }; 
        next(); // Proceed to the next function (the actual route logic)
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// --- Protected Task API Endpoints ---
// We add 'authMiddleware' to each route to make sure only logged-in users can access them.

// GET /api/tasks: Fetch tasks for the logged-in user
app.get('/api/tasks', authMiddleware, async (req, res) => {
    try {
        // Find tasks that belong ONLY to the user ID from the token
        const tasks = await Task.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json(tasks.map(task => ({ id: task._id, text: task.text })));
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching tasks' });
    }
});

// POST /api/tasks: Add a new task for the logged-in user
app.post('/api/tasks', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Task text is required' });
        }
        // Create a new task and associate it with the logged-in user's ID
        const newTask = new Task({ text, user: req.user.userId });
        await newTask.save();
        res.status(201).json({ id: newTask._id, text: newTask.text });
    } catch (err) {
        res.status(500).json({ error: 'Server error while adding task' });
    }
});

// DELETE /api/tasks/:id: Remove a task belonging to the logged-in user
app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
    try {
        // Find the task by its ID AND ensure it belongs to the logged-in user
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

        if (!task) {
            return res.status(404).json({ error: 'Task not found or user not authorized' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Server error while deleting task' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});