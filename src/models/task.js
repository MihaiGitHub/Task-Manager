const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

// Create task model; Once the second object argument is passed in, mongoose converts it into a schema
const Task = mongoose.model('Task', taskSchema)

module.exports = Task