const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

// Create user model
const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
})

// Create a user instance
const me = new User({
    name: 'Mike',
    age: 23
})

// Saves the instance and returns a promise
me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log(error)
})