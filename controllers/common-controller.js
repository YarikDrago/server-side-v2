const commonService = require('../service/common-service')
const newMailer = require('../newMailer/newMailer')
class CommonController{
    async test(req, res){
        try{
            console.log("try test message")
            const test = await commonService.testMessage();
            return res.json(test)
        } catch (e) {
            console.log("try test message ERROR")
        }
    }

    async getUsers(req, res){
        try {
            const users = await commonService.getUsers().then((resp) => {
                console.log("get users (res):", resp.status, resp.data)
                return resp.data
            })
            return res.json(users)
        } catch (e) {
            console.log("try get users error")
        }
    }

    async login(req, res){
        try {
            const datar = await commonService.login().then((resp) => {
                console.log("login (res):", resp.status, resp.data)
                return resp.data
            })
            return res.json(datar)
        } catch (e) {
            console.log("try get users error")
        }
    }

    async sendEmailMessage(req, res){
        console.log("try to send email")
        const {name} = req.body
        const {surname} = req.body
        const {email} = req.body
        const {telephone} = req.body
        const {message} = req.body
        console.log("Getted name: ", name)
        console.log("next mailer 2")
        try{
            console.log("try to send message to email")
            await newMailer(name, surname, email, telephone, message)
                .then(subres => {
                    const subresArray = subres.split(' ')
                    console.log("subres",subres)
                    res.status(subresArray[0]).json(subresArray[1]) //status 200 - send ('OK')
                })
        } catch (e){
            console.log("error of sending Email message")
        }
    }
}

module.exports = new CommonController()
