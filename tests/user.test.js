const request = require('supertest')

/* Load app for testing purpose */
const app = require('../src/app')

/* Load in User model for testing */
const User = require('../src/models/user')

/* Function to run before each test case in this test suite */
beforeEach(async () => {
    /* Delete all users before running each test case */
    await User.deleteMany()
})

/* Function to run after each test case in this test suite */
afterEach(() => {
    console.log('after each')
})

test('Should signup a new user', async () => {

    // Send data object to user signup endpoint
    await request(app).post('/users').send({
        name: 'Fedor',
        email: 'fedor@yahoo.com',
        password: 'Hdhss87$#'
    }).expect(201)

})