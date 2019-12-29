const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = 'xxxx'

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: 'mihai.sanfran@gmail.com',
        from: 'mihai.sanfran@gmail.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the app, ${name}!`,
       // html: ''
    })
}

module.exports = {
    sendWelcomeEmail
}