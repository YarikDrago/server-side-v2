const UserModel = require('../models/user-model');
const uuid = require("uuid");
const bcrypt = require('bcrypt')
const {hash} = require("bcrypt");
const UserDto = require("../dtos/user-dto");
const tokenService = require('../service/token-service')
const mailService = require('../service/mail-service')
const ApiError = require('../exeptions/api-error')
// const bcrypt = require('bcrypt');
// const uuid = require('uuid');
// const mailService = require('./mail-service'); // для отправки сообщения по почту с ссылкой для активации
// const tokenService = require('./token-service');
// const UserDto = require('../dtos/user-dto');
// const ApiError = require('../exceptions/api-error.js')

class UserService {

    async registration(email, nickname, password){
        console.log("registration user service")
        // убеждаемся что такого пользователя нет в БД
        let candidate = await UserModel.findOne({email})
        console.log("candidate:", candidate)
        if (candidate){
            // отправляем сообщеие на почту, что кто-то пытался зарегестрироваться с данным email
            console.log("user already was added")
            await mailService.sendMessageOfRepeatRegistration(email)
            return {messageStatus: 'good', message: 'On current email was sent message with information'}
            // throw new Error(`Пользователь с email: ${email} уже существует`)
            // throw ApiError.BadRequest(`Пользователь с email: ${email} уже существует`)
        }
        console.log("new email to DB", email)
        console.log("check nickname", nickname)
        candidate = await UserModel.findOne({nickname})
        if (candidate){
            console.log("nickname already exist")
            await mailService.sendMessageOfRepeatRegistration(email)
            return {messageStatus: 'error', message: `Current nickname don't available`}
            // throw new Error(`Пользователь с email: ${email} уже существует`)
            // throw ApiError.BadRequest(`Пользователь с email: ${email} уже существует`)
        }
        console.log("nickname is OK")
        // хеширование пароля. 1 парметр - сам пароль, 2 - "соль"
        const hashPassword = await hash(password, 3);
        // все операции связанные с БД асинхронные
        // генерирование ссылки для активации. Функция возвращает рандомную уникальную строку
        const activationLink = uuid.v4();
        console.log("activation link was created")
        const user = await UserModel.create({email, nickname, password: hashPassword, activationLink})
        // отправка активационного пиьма на почту
        // activationLink надо поправить
        console.log("try to send activation link")
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        console.log("user was added to DB")
        const userDto = new UserDto(user); // id, email, isActivated -> используем как payload
        console.log("DTO -- pass")
        const tokens = tokenService.generateTokens({...userDto}) // генерироуем пару токенов
        console.log("token generation -- pass")
        // сохраняем refresh токен в БД
        // await tokenService.saveToken(userDto.id, tokens.refreshToken);
        // по итогу функция возвращает инофрмацию о пользователе и токены
        return {...tokens, user: userDto, messageStatus: 'good', message: 'On current email was sent message with information'}
    }

    async login(email, password){
        console.log("login user service")
        console.log("email: ", email)
        console.log("password: ", password)
        // find email in DB
        const user = await UserModel.findOne({email})
        if (!user){
            console.log('current user was not found in DB');
            // return {message: "Error DB"}
            throw ApiError.IncorrectPasswordLogin()
            // return {messageStatus: 'error', message: `Invalid login/password`}
            // return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
        }
        console.log("user was found in DB")
        // проверяем, активирован ли пользователь
        if (!user.isActivated){
            console.log("user has not activated. Firstly must activate")
            // return {message: "Invalid login/password"}
            return {messageStatus: 'error', message: `Invalid login/password`}
        }
        console.log("user was activated")
        const isPassEquals = await bcrypt.compare(password, user.password) // 1-пароль введенный, пароль из БД.
        if (!isPassEquals){
            console.log("incorrect password")
            // return {error: true, message: 'invalid login/password'}
            return {messageStatus: 'error', message: `Invalid login/password`}
        }
        console.log("valid password");
        console.log('user data', user);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        // return {message: 'User is trying to login'}
        return {...tokens, user: userDto};
    }

    async logout(refreshToken){
        //удаляем refreshToken из БД
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async activate(activationLink){
        // в БД ищем пользователя по этой ссылке
        const user = await UserModel.findOne({activationLink})
        if (!user){
            // throw new Error('Некорректная ссылка активации')
            // throw ApiError.BadRequest('Некорректная ссылка активации')
            return {error: true, message: "registration link error"}
        }
        // меняем поле isActivated на true
        user.isActivated = true;
        await user.save(); // сохраняем обновленного пользователя в БД
    }

    async getAllUsers(){
        console.log("get all users")
        const users = await UserModel.find(); // если переметры внутри функции не указывать, то вернут все записи
        return users;
    }
}

module.exports = new UserService();

