// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    text: { 
        type: String, 
        required: true 
    },
    // This links each task to a specific user
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;