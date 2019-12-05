const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

// Create user model
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    }
})

// Create a user instance
const me = new User({
    name: 'Mike',
    age: 23,
    email: 'mike@yahoo.com'
})

// Saves the instance and returns a promise
me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log(error)
})

// Create task model; Mongoose takes model name, makes it lower case and plural
const Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
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