const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

// Create task model; Mongoose takes model name, makes it lower case and plural
const Task = mongoose.model('Task', {
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

// Create a task instance
const task = new Task({
    description: 'Go to gym',
    completed: false
})

// Saves the instance and returns a promise
task.save().then(() => {
    console.log(task)
}).catch((error) => {
    console.log(error)
})