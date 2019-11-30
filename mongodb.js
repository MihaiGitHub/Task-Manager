/* File to support all operations for MongoDB */

const mongodb = require('mongodb')
// Gives access to the functions that manipulate the database
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// useNewUrlParser needed to pass connectionURL correctly
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    // Callback function once the connect operation is complete
    if(error){
        return console.log('Unable to connect to database!')
    }

    console.log('Connected!')
})