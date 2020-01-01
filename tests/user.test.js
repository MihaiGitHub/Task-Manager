const request = require('supertest')

/* Load app for testing purpose */
const app = require('../src/app')

test('Should signup a new user', async () => {

    // Send data object to user signup endpoint
    await request(app).post('/users').send({
        name: 'Fedor',
        email: 'fedor@yahoo.com',
        password: 'Hdhss87$#'
    }).expect(201)

})