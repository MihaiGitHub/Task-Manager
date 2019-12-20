const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    }
})

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

// Create user model; Once the second object argument is passed in, mongoose converts it into a schema
// 
const User = mongoose.model('User', userSchema)

module.exports = User