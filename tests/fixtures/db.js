const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')

/* Create a test user for testing tasks */
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'John',
    email: 'fedor@yahoo.com',
    password: 'Hdhss87$#',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

/* Function to be user with beforeEach() */
const setupDatabase = async () => {
    /* Delete all users before running each test case */
    await  User.deleteMany()

    /* Save test user to database after deleteMany to test other endpoints */
    await new User(userOne).save()
}

module.exports = {
    userOne,
    userOneId,
    setupDatabase
}