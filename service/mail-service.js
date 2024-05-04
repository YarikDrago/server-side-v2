const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 2525,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        },
            {
                from: `<${process.env.SMTP_USER}>`
            }
            )
    }
    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: `${process.env.MAIL_TITLE} <${process.env.SMTP_USER}>`,
            // to: 'doudou239@gmail.com',
            to: to,
            subject: '[IU] Confirm E-mail address',
            text: '',
            html:
            `    
                <div>
                    <div style="
                        display: block;
                        width: 100%;
                        gap: 15px;
                        "
                    >
                        <h1>Welcome to IU!</h1>
                        <p>Click on the button below to confirm the email address and activate the account.</p>
                        <p>If you have not registered, then do not press the button.</p>       
                    </div>
                    <div style="
                        display: flex;
                        align-items: center;
                        width: 100%;
                    "
                    >
                        <a style="
                            position: relative;
                            display: block;
                        " href="${link}">
                            <button style="
                                position: relative;
                                background-color: #0145f0;
                                font-weight: bold;
                                color: antiquewhite; 
                                padding: 10px; 
                                border-radius: 5px; 
                                border: none; 
                                text-decoration: none;
                                cursor: pointer;
                                "
                            >Confirm my email</button>    
                        </a>
                    </div>
                </div>
            `
        })
    }

    async sendMessageOfRepeatRegistration(email){
        console.log(`try to send repeat registration alert to ${email}`)
        await this.transporter.sendMail({
            // from: process.env.SMTP_USER,
            from: `${process.env.MAIL_TITLE} <${process.env.SMTP_USER}>`,
            // to: 'doudou239@gmail.com',
            to: email,
            subject: '[IU] Retry registration',
            text: '',
            html:
                `    
                <div>
                    <div style="
                        display: block;
                        width: 100%;
                        gap: 15px;
                        "
                    >
                        <p>Someone tries to repeatedly registrate on <a href="https://uliantcev.ru">IU</a> using your email address.</p>
                        <p>If it was you, and you forgot password, you can recover password.</p>
                    </div>
                </div>
            `
        })
    }
}

module.exports = new MailService();

