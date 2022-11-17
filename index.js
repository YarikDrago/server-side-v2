require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mailer = require('./nodemailer/nodemailer')
const googleSheet = require('./googleSheet/googleSheet')
const transformSheetData = require('./googleSheet/transformSheetData')



const app = express()
app.use(express.json())
app.use(cors())
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()

const footballChatMsg = ['connected']

app.ws('/footballchat', (ws, req)=>{
    ws.on('message', (msg) => {
        console.log("msg", msg)
        // ws.send('yes! yes! I can hear you')
        // для все подключенных клиентов
        aWss.clients.forEach(client => {
            console.log("aws")
            // client.send('yes! yes! I can hear you')
            client.send(msg)
        })
    })
})

app.get('/test',  async(req, res) => {
    try {
        res.status(200).json("test request pass!")
    } catch (e) {
        console.log("test error: ", e)
    }
})

app.post('/send_email', async(req, res) => {
    try {
        const {name} = req.body
        const {surname} = req.body
        const {email} = req.body
        const {telephone} = req.body
        const {message} = req.body
        console.log("Getted name: ", name)
        mailer(name, surname, email, telephone, message)
        res.status(200).json('Res: message was sent') //status 200 - send ('OK')
    } catch (e) {
        console.log('sending email error: ', e)
    }
})

app.get('/football_data',  async(req, res) => {
    try {
        googleSheet().then(subres => {
            transformSheetData(subres.values)
            // res.status(200).json(subres.values)
            res.status(200).json(transformSheetData(subres.values))
        })
    } catch (e) {
        res.status(404).json({"erorr": "network error"})
        // console.log("test error: ", e)
    }
})


const start = async () => {
    const PORT = process.env.PORT || 5000
    try {
        app.listen(PORT, () => console.log('Server was started on port: ', PORT))
    } catch (e) {
        console.log('Starting server error: ', e)
    }
}

start()
