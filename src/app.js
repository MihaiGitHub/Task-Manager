/* File that configures application. Can load app from here for tests */
const express = require('express')

// Ensure mongoose connects to database
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

// // Setup "Site under maintenance" middleware function
// app.use((req, res, next) => {
//     res.status(503).send('Site under maintenance')
// })

// Automatically parse data as a JSON object in all request handlers
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

module.exports = app