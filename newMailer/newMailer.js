const nodemailer = require('nodemailer')

async function newMailer(name, surname, email, telephone, message){
    console.log("new mailer")
    const messageSMTP = {
        from: process.env.MAIL_FROM,
        to: process.env.RECIPIENT_MAIL,
        subject: 'From my website',
        html:`
            <div>
                <h3>From: ${name} ${surname}</h3>
                <h3>Email: ${email}</h3>
                <h3>Telephone: ${telephone}</h3>
                <h3>Message:</h3>
                <h1>${message}</h1>
            </div>`
    }
    let promise = new Promise((res, rej) => {

        transporter.sendMail(messageSMTP, (err, info) => {
            if(err){
                console.log("Error", err)
                rej = err
            }
            // console.log('Email was sent. ', info)
            res(info.response)
        })
    })
    return promise
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOSTING_NAME,
    port: 2525,
    secure: false,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_MAIL_PASSWORD
    }
},{
    from: `<${process.env.SMTP_MAIL}>`
})



module.exports = newMailer