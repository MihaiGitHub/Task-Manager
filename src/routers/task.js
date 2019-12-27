const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// Create endpoint for creating a new task
router.post('/tasks', auth, async (req, res) => {
    // Concatenate task owner with req body
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        // Save task in database
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

// Create endpoint for fetching all tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    try {
        // Populate tasks
        await req.user.populate({
            path: 'tasks',
            match // Match all the tasks you want to pull
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

// Create endpoint for fetching a particular task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // Find task limited by multiple fields
        const task = await Task.findOne({ _id, owner: req.user._id })
 
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

// Create endpoint for updating existing task
router.patch('/tasks/:id', auth, async (req, res) => {
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
        // Find the task with this task id and owner id
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if(!task){
            return res.status(404).send()
        }

        // Apply the updates dynamically
        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Create endpoint for deleting task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router