const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    taskDescription: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
module.exports = mongoose.model('Task', TaskSchema);
