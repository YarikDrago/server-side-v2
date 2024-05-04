const userService =require('../service/user-service');
const {validationResult} = require("express-validator");
// const e = require("express");
// const {validationResult} = require('express-validator')
// const ApiError = require('../exceptions/api-error.js')
// const {compareSync} = require("bcrypt");
class UserController {

    async registration(req, res){
        try{
            console.log("try to register user")
            const errors = validationResult(req);
            // проверяем что пришли хоть какие-нибудь данные
            if (!errors.isEmpty()){
                console.log('registration error')
                // return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
                return res.status(200).send({error: true, messageStatus: "error", message: "incorrect Email/Password"})
            }
            const {email, nickname, password} = req.body; // вытаскиваем из тела запроса email и password
            console.log("email:", email)
            console.log("nickname:", nickname)
            console.log("password:", password)
            const userData = await userService.registration(email, nickname, password);
            console.log("added to DB")
            // refresh token храним в куках
            // если используется https, то добавить флаг secure: true
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}) // флаг httpOnly чтоыб cookie нельзя было изменять
            // возвращаем в браузер информацию о пользователе полученную как response
            return res.json(userData);
            // return res.json("callback answer of registration");
        } catch (e){
            console.log("Registration ERROR")
            return res.status(200).send({error: true, message: 'Server error'})
        }
    }

    async activate(req, res, next){
        try{
            // из строки запроса получаем ссылку активации
            const  activationLink = req.params.link // link - динамический параметр в endpoint
            await userService.activate(activationLink);
            // после того как юзер перешел по ссылке редеректим его на сайт
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            // console.log(e)
            next(e)
        }
    }

    async login (req, res, next){
        try {
            console.log("try to login")
            console.log("request", req.body)
            let {email, password} = req.body;
            // email to lower case
            email = email.toLowerCase();
            // console.log("ëmail:", email, email.toLowerCase())
            const userData = await userService.login(email, password)
            // записываем в response cookie refresh token
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            // return res.status(200).send({message: 'login (server message)'})
            return res.status(200).json(userData);
        } catch (e){
            console.log('login controller error')
            console.log("error:", e)
            next(e)
        }
    }

    async logout (req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {

        }
    }
    async getUsers(req, res){
        try{
            // res.json(['123', '456']); // для теста метода
            // return res //для теста
            console.log("try to get users")
            const users = await userService.getAllUsers();
            console.log("users", users)
            //  возвращаем ответ на клиент
            return res.json(users); // в json помещаем список пользователей
        } catch (e) {
            console.log("get users ERROR")
            // next(e)
        }
    }
}

module.exports = new UserController();
