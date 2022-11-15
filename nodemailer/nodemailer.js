const nodemailer = require('nodemailer')

const smtpConfig = {

}

const transporter = nodemailer.createTransport({
    host: 'smtp.timeweb.ru',
    port: 2525,
    secure: false,
    auth: {
        user: 'commonmail@uliantcev.ru',
        pass: 'x85gz3Pj'
    }
},{
    from: '<commonmial@uliantcev.ru>'
})

const mailer = (name, surname, email, telephone, message) => {
    const messageSMTP = {
        from: process.env.MAIL_FROM,
        to: 'doudou239@gmail.com',
        subject: 'Test email 3',
        html:`
            <div>
                <h3>From: ${name} ${surname}</h3>
                <h3>Email: ${email}</h3>
                <h3>Telephone: ${telephone}</h3>
                <h3>Message:</h3>
                <h1>${message}</h1>
            </div>`
    }
    transporter.sendMail(messageSMTP, (err, info) => {
        if(err) return console.log(err)
        console.log('Email was sent. ', info)
    })
}

module.exports = mailer