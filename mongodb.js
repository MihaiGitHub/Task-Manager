/* File to support all operations for MongoDB */

const mongodb = require('mongodb')
// Gives access to the functions that manipulate the database
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// By picking a db name then connecting, MongoDB will automatically create the db if not exists
// useNewUrlParser needed to pass connectionURL correctly
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    // Callback function once the connect operation is complete
    if(error){
        return console.log('Unable to connect to database!')
    }

    // Get the database connection
    const db = client.db(databaseName)

    // // insertOne is async and has a callback
    // db.collection('users').insertOne({
    //     name: 'Mike',
    //     age: 23
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert user')
    //     }

    //     // ops is an array of all documents inserted
    //     console.log(result.ops)
    // })

    db.collection('users').insertMany([
        {
            name: 'Jen',
            age: 25
        }, {
            name: 'John',
            age: 24
        }
    ], (error, result) => {
        if(error){
            return console.log('Unable to insert documents!')
        }

        console.log(result.ops)
    })

    db.collection('tasks').insertMany([
        {
            description: 'Go to gym',
            completed: true
        }, {
            description: 'Finish class',
            completed: true
        }, {
            description: 'Eat meal',
            completed: false
        }
    ], (error, result) => {
        if(error){
            return console.log('Unable to insert documents!')
        }

        console.log(result.ops)
    })
})