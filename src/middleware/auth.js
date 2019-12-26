const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Middleware to authenticate user
const auth = async (req, res, next) => {
   try {
       // Access token from header of request
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisisasecret') // Use same secret used to generate it
        
        // User ID was used to generate the token and can be retrieved during decoding
        // Also check if this token is still part of the users tokens array
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user

        // Run route handler
        next()
   } catch (e) {
        // If user is not authenticated
        res.status(401).send({ error: 'Please authenticate.'})
   }
}

module.exports = auth