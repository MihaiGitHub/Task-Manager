/* File that starts application */
const express = require('express')

// Ensure mongoose connects to database
require('./db/mongoose')

// Load user model
const User = require('./models/user')

// Load task model
const Task = require('./models/task')

const app = express()

// Get default port; For deployment on Heroku; or localhost
const port = process.env.PORT || 3000

// Automatically parse data as a JSON object in all request handlers
app.use(express.json())

// Create endpoint for creating a new user
app.post('/users', (req, res) => {
    // Get user data coming from POST request
    const user = new User(req.body)

    // Save user in database
    user.save().then(() => {
        res.status(201).send(user)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

// Create endpoint for fetching users
app.get('/users', (req, res) => {
    // Fetch all users in db
    User.find({}).then((users) => {
        res.send(users)
    }).catch((error) => {
        res.status(500).send()
    })
})

// Create endpoint for fetching a particular user
app.get('/users/:id', (req, res) => {
    // Get user id from request params
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if(!user){
            return res.status(404).send()
        }

        // Default status will be 200
        res.send(user)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// Create endpoint for creating a new task
app.post('/tasks', (req, res) => {
    // Get task data coming from POST request
    const task = new Task(req.body)

    // Save task in database
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

app.listen(port, () => {
    console.log('Server is up on port ', + port)
})

