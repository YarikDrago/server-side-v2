// import axios from "axios";
const axios  = require('axios')

require('dotenv').config()

async function googleSheet(){
    console.log("get google sheet data")
    console.log("url", process.env.SHEET_LINK)
    const promise = await axios.get(process.env.SHEET_LINK)
    // const dataPromise = promise.then((res) => res.data)
    // return dataPromise
    // console.log("prom", promise.data)
    return promise.data
    // try{
    //     await axios.get(process.env.SHEET_LINK)
    //         .then((res) => {
    //             // console.log("res", res.data)
    //             return res.status
    //         })
    // }catch (e) {
    //     console.log("error code:", e.code, "error:", e )
    //     return e
    // }
}

module.exports =googleSheet



