// import axios from "axios";
const axios  = require('axios')

require('dotenv').config()

async function googleSheet(){
    console.log("get google sheet data")
    // console.log("url", process.env.SHEET_LINK)
    const promise = await axios.get(process.env.SHEET_LINK)
    return promise.data
}

module.exports =googleSheet



