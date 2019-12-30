/* File that starts application */
const express = require('express')

// Ensure mongoose connects to database
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

// Get default port; For deployment on Heroku; or localhost
const port = process.env.PORT

// // Setup "Site under maintenance" middleware function
// app.use((req, res, next) => {
//     res.status(503).send('Site under maintenance')
// })

// Automatically parse data as a JSON object in all request handlers
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ', + port)
})
