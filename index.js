require('dotenv').config()
//
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const http = require('http');
const https = require("https");
const fs = require("fs");
const cors = require('cors')
const path = require("path");
const axios = require('axios')
const routerUsers = require('./router/routerUsersDB')
const routerCommon = require('./router/routerCommon')
// const { MongoClient } = require('mongodb');
// const errorMiddleware = require('./middlewares/error-middleware')

// const googleSheet = require('./googleSheet/googleSheet')
// const transformSheetData = require('./googleSheet/transformSheetData')

const directoryToServe = process.env.CLIENT_PATH

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors())
// app.use(cors(
//     {
//         credentials: true,
//         origin: process.env.CLIENT_URL //fronted way
//     }
// ));

// Middleware для перенаправления с https на https и на страницу /start
app.use((req, res, next) => {
    // Проверяем, если запрос пришел на корневой URL
    if (req.url === '/') {
        // Перенаправляем на страницу /start
        return res.redirect(301, '/start');
    }
    // Если запрос не на корневой URL, пропускаем его дальше
    next();
});

app.use('/start', express.static(path.join(__dirname, '', '../client')))
// app.use('/', express.static(path.join(__dirname, '', '../client')))
// app.use('/football2', express.static(path.join(__dirname, '', process.env.FOOTBALL_PATH)))

app.use('/api', routerUsers);
app.use('/common', routerCommon);

// обработчик ошибок обязательно идет последним в цепочке middleware
// app.use(errorMiddleware);

// in the very end
app.use('*', express.static(path.join(__dirname, '', directoryToServe)))

const start = async () => {
    const PORT = Number(process.env.PORT || 5000)
    try {
        // connect to DB
        // await mongoose.connect(process.env.DB_URL,{
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // })
        // app.listen(PORT, () => console.log('Server was started on port: ', PORT))
        if (process.env.TP === 'https'){
            const options = {
                key: fs.readFileSync('server.key'),
                cert: fs.readFileSync('server.crt')
            };
            const server = https.createServer(options, app)
            server.listen(PORT, () => console.log(`Server was started on port: ${PORT} https`))
        } else {
            app.listen(PORT, ()=>{console.log(`server started on port: ${PORT}, http`)})
        }
    } catch (e) {
        console.log('Starting server error: ', e)
    }
}

start()

