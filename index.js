require('dotenv').config()

const axios = require('axios')
const express = require('express')
const http = require('http')
const https = require('https');
const fs = require('fs');
const cors = require('cors')
const path = require('path')

//const mailer = require('./nodemailer/nodemailer')
const newMailer = require('./newMailer/newMailer')
const googleSheet = require('./googleSheet/googleSheet')
const transformSheetData = require('./googleSheet/transformSheetData')

const app = express()
app.use(express.json())
app.use(cors())

// const directoryToServe = 'client'
const directoryToServe = process.env.CLIENT_PATH

// app.use('/', express.static(path.join(__dirname, '..', directoryToServe)))
app.use('/', express.static(path.join(__dirname, '', directoryToServe)))


// const WSServer = require('express-ws')(app)
// const aWss = WSServer.getWss()
// const footballChatMsg = ['connected']
// app.ws('/footballchat', (ws, req)=>{
//     ws.on('message', (msg) => {
//         console.log("msg", msg)
//         // ws.send('yes! yes! I can hear you')
//         // для все подключенных клиентов
//         aWss.clients.forEach(client => {
//             console.log("aws")
//             // client.send('yes! yes! I can hear you')
//             client.send(msg)
//         })
//     })
// })




app.get('/test',  async(req, res) => {
    try {
        res.status(200).json("test request pass!")
    } catch (e) {
        console.log("test error: ", e)
    }
})


// app.post('/send_email', async(req, res) => {
//     try {
//         const {name} = req.body
//         const {surname} = req.body
//         const {email} = req.body
//         const {telephone} = req.body
//         const {message} = req.body
//         console.log("Getted name: ", name)
//         console.log("next mailer")
//         mailer(name, surname, email, telephone, message)
//         res.status(200).json('Res: message was sent') //status 200 - send ('OK')
//     } catch (e) {
//         console.log('sending email error: ', e)
//     }
// })

app.post('/send_email', async(req, res) => {
    const {name} = req.body
    const {surname} = req.body
    const {email} = req.body
    const {telephone} = req.body
    const {message} = req.body
    console.log("Getted name: ", name)
    console.log("next mailer 2")
    try {
        await newMailer(name, surname, email, telephone, message)
            .then(subres => {
                const subresArray = subres.split(' ')
                console.log("subres",subres)
                res.status(subresArray[0]).json(subresArray[1]) //status 200 - send ('OK')
            })
    } catch (e) {
        console.log('sending email error: ', e)
    }
})

app.get('/football_data',  async(req, res) => {
    try {
        await googleSheet().then(subres => {
            res.status(200).json(transformSheetData(subres.values))
        })
    } catch (e) {
        // res.status(404).json({"erorr": "network error"})
        res.status(e.code).json({"erorr": "network error"})
        // console.log("test error: ", e)
    }
})

app.get('/testhttps', async(req, res) => {
    try{
        const promise = await axios.get("https://jsonplaceholder.typicode.com/users/1")
        console.log("json", promise.data)
        res.status(200).json(promise.data)
    } catch (e) {

    }
})

app.get('/test2', async(req, res) => {
    try{
        const promise = await https.get("https://jsonplaceholder.typicode.com/users/1")
        console.log("json", promise.data)
        res.status(200).json(promise.data)
    } catch (e) {

    }
})

app.use('*', express.static(path.join(__dirname, '', directoryToServe)))


const start = async () => {
    const PORT = Number(process.env.PORT || 5000)
    if (process.env.TP === 'https'){
        const options = {
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.crt')
        };
        const server = https.createServer(options, app)
        try {
            // app.listen(PORT, () => console.log('Server was started on port: ', PORT))
            server.listen(PORT, () => console.log(`Server was started on port: ${PORT} https`))
        } catch (e) {
            console.log('Starting server error: ', e)
        }
    } else {
        app.listen(PORT, ()=>{console.log(`server started on port: ${PORT}, http`)})
    }

}

start()
