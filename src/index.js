/* File that starts application */

const express = require('express')
const app = express()

// Get default port; For deployment on Heroku; or localhost
const port = process.env.PORT || 3000

// Automatically parse data as a JSON object in all request handlers
app.use(express.json())

// Create method for creating a new user
app.post('/users', (req, res) => {
    console.log(req.body)
    res.send('testing')
})

app.listen(port, () => {
    console.log('Server is up on port ', + port)
})

