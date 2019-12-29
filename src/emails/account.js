const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = 'xxxx'

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mihai.sanfran@gmail.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the app, ${name}!`,
        // html: ''
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mihai.sanfran@gmail.com',
        subject: 'Membership Cancelled!',
        text: `You have cancelled access to the app, ${name}!`,
        // html: ''
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}