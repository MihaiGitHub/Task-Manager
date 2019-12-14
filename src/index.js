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

// Create endpoint for updating existing user
app.patch('/users/:id', async (req, res) => {
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
app.delete('/users/:id', async (req, res) => {
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

// Create endpoint for creating a new task
app.post('/tasks', async (req, res) => {
    try {
        // Get task data coming from POST request
        const task = new Task(req.body)

        // Save task in database
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

// Create endpoint for fetching all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

// Create endpoint for fetching a particular task
app.get('/tasks/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findById(_id)

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

// Create endpoint for updating existing task
app.patch('/tasks/:id', async (req, res) => {
    // Only allow certain properties to be updated
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']

    // Check to see if properties in the request body match the allowed updates
    // every returns a single true/false if every item in the array meets a certain criteria
    const isValidOperation = updates.every((update) => {
        // returns a boolean if it includes update
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        // Return the new task with updated info and validate new info before updating
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.listen(port, () => {
    console.log('Server is up on port ', + port)
})

