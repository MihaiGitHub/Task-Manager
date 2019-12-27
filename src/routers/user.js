const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


// Create endpoint for creating a new user (sign up)
router.post('/users', async (req, res) => {
    // Get user data coming from POST request
    const user = new User(req.body)

    try {
        await user.save()

        const token = await user.generateAuthToken()

        // Code below this line only runs if promise from above is fulfilled
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Create endpoint for signing in user
router.post('/users/login', async (req, res) => {
    try {
        // Find the correct using custom function
        const user = await User.findByCredentials(req.body.email, req.body.password)

        // Function that returns the token and sends it to the client
        // Function will return a promise so it can do async things
        // Create this function to sit on the user instance
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    // Could have many different tokens corresponding to different logged in devices
    // Remove only the token on the current device
    try {
        // Create a new array of tokens without the token from this request
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        // Save the user without the token
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // Empty out all user tokens (logout of all device sessions)
        req.user.tokens = []

        // Save the user without the tokens
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Create endpoint for fetching user profile and add middleware auth
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// // Create endpoint for fetching a particular user
// router.get('/users/:id', async (req, res) => {
//     // Get user id from request params
//     const _id = req.params.id

//     try {
//         // Mongoose automatically converts string IDs to ObjectID
//         const user = await User.findById(_id)

//         if(!user){
//             return res.status(404).send()
//         }

//         // Default status will be 200
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

// Create endpoint for updating authenticated user profile
router.patch('/users/me', auth, async (req, res) => {
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
        // Update the values the user is updating dynamically
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Create endpoint for deleting own user profile
router.delete('/users/me', auth, async (req, res) => {
    try {
        // Removes entire user that is authenticated
        await req.user.remove()

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    dest: 'images' // Directory to save files
})

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send('File uploaded')
})

module.exports = router