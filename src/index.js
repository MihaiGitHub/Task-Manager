/* File that starts application */
const express = require('express')

// Ensure mongoose connects to database
require('./db/mongoose')

// Load user model
const User = require('./models/user')

const app = express()

// Get default port; For deployment on Heroku; or localhost
const port = process.env.PORT || 3000

// Automatically parse data as a JSON object in all request handlers
app.use(express.json())

// Create method for creating a new user
app.post('/users', (req, res) => {
    // Get user data coming from POST request
    const user = new User(req.body)

    // Save user in database
    user.save().then(() => {
        res.send(user)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

app.listen(port, () => {
    console.log('Server is up on port ', + port)
})

