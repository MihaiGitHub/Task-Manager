const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// Added as middleware to user model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"') 
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// Set up a virtual property - a relationship between the user and task
// Virtual because not actually changing anything that is stored for the user document
// A way for Mongoose to know how these two entities (user/tasks) are related
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // Where local data is stored
    foreignField: 'owner' // Name of field on the task that will create this relationship
})

// toJSON - allows this method to run on userSchema without even calling it
userSchema.methods.toJSON = function () {
    const user = this
    // toObject() method provided by Mongoose to get raw user model data
    const userObject = user.toObject()

    // Delete user object properties before returning
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// Standard function because need to use 'this' binding
// Methods accessible on the instances (instance methods)
userSchema.methods.generateAuthToken = async function () {
    const user = this

    // Generate json web token
    // 1st argument is the payload that identifies the user (use user id) as string
    // 2nd argument is the secret 
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisasecret')

    // After token is created, add it to token array so it is saved on server
    // Concat item to the tokens array
    user.tokens = user.tokens.concat({ token }) // token: token

    // Save token to database
    await user.save()

    return token
}

// Custom function on userSchema to check if user provided correct password
// Static methods are accessible on the model (model methods)
userSchema.statics.findByCredentials = async (email, password) => {
    // Find the user
    const user = await User.findOne({ email }) // email: email

    if(!user){
        throw new Error('Unable to login')
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

// Do something before user is saved using .pre
// Second argument needs to be a standard function because 'this' plays an important role
userSchema.pre('save', async function (next) {
    // this = the document that is being saved
    const user = this

    // Only hash the password if its been modified by the user
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    // call next when done
    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

// Create user model; Once the second object argument is passed in, mongoose converts it into a schema
const User = mongoose.model('User', userSchema)

module.exports = User