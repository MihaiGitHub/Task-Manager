/* File that starts application */

const express = require('express')
const app = express()

// Get default port; For deployment on Heroku; or localhost
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port ', + port)
})

