const request = require('supertest')

/* Load app for testing purpose */
const app = require('../src/app')

/* Load in User model for testing */
const User = require('../src/models/user')

/* Create a test user */
const userOne = {
    name: 'John',
    email: 'fedor@yahoo.com',
    password: 'Hdhss87$#'
}

/* Function to run before each test case in this test suite */
beforeEach(async () => {
    /* Delete all users before running each test case */
    await  User.deleteMany()

    /* Save test user to database after deleteMany to test other endpoints */
    await new User(userOne).save()
})

/* Function to run after each test case in this test suite */
afterEach(() => {
    console.log('after each')
})

test('Should signup a new user', async () => {

    // Send data object to user signup endpoint
    await request(app).post('/users').send({
        name: 'Fedor',
        email: 'fedor@gmail.com',
        password: 'Pds56h789'
    }).expect(201)

})

test('Should login existing user', async () => {

    // Send data object to user login endpoint
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

})