const express = require('express')
const User = require('../models/user')
const router = new express.Router()

// Create endpoint for creating a new user
router.post('/users', async (req, res) => {
    // Get user data coming from POST request
    const user = new User(req.body)

    try {
        await user.save()
        // Code below this line only runs if promise from above is fulfilled
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Create endpoint for fetching users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

// Create endpoint for fetching a particular user
router.get('/users/:id', async (req, res) => {
    // Get user id from request params
    const _id = req.params.id

    try {
        // Mongoose automatically converts string IDs to ObjectID
        const user = await User.findById(_id)

        if(!user){
            return res.status(404).send()
        }

        // Default status will be 200
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Create endpoint for updating existing user
router.patch('/users/:id', async (req, res) => {
    // Only allow certain properties to be updated
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    // every returns a single true/false if every item in the array meets a certain criteria
    const isValidOperation = updates.every((update) => {
        // returns a boolean if it includes update
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        // Return the new user with updated info and validate new info before updating
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Create endpoint for deleting user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router