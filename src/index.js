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
app.post('/users', async (req, res) => {
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
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

// Create endpoint for fetching a particular user
app.get('/users/:id', async (req, res) => {
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

// Create endpoint for fetching all tasks
app.get('/tasks', (req, res) => {
    Task.find((tasks) => {
        res.send(tasks)
    }).catch((error) => {
        res.status(500).send()
    })
})

// Create endpoint for fetching a particular task
app.get('tasks/:id', (req, res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }).catch((error) => {
        res.status(500).send()
    })
})

app.listen(port, () => {
    console.log('Server is up on port ', + port)
})

