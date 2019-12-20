const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

// Create endpoint for creating a new task
router.post('/tasks', async (req, res) => {
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
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

// Create endpoint for fetching a particular task
router.get('/tasks/:id', async (req, res) => {
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
router.patch('/tasks/:id', async (req, res) => {
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
        // Find the task
        const task = await Task.findById(req.params.id)

        // Apply the updates dynamically
        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Create endpoint for deleting task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router