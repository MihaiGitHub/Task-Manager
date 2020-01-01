/* Starter file. Load in the express app */
const app = require('./app')

/* Find the default port. For deployment on Heroku; or localhost */
const port = process.env.PORT

/* Call listen */
app.listen(port, () => {
    console.log('Server is up on port ', + port)
})
