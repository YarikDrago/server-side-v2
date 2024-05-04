const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
    generateTokens(payload){
        // генерация access token
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn:'1m' // длительность жизни токенов
        })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn:'30d' // длительность жизни токенов
        })
        return {
            accessToken,
            refreshToken
        }
    }

    // валидация токена. То что он не подделан и срок годности не иссяк
    // внутри токена есть указатель на время жизни токена. Если токен просрочен, то вернется false.
    // Если токен при сравнении с сигнатурой не верный, то вернется false
    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    // для сохранения токена юзера в БД
    async saveToken(userId, refreshToken){
        // сначала пытаемся найти такой токен в БД
        // если юзер уже залогинен и пытается войти с другого устройства, то токен перезапишется и юзера выкинет с первого устройства
        // стоит помнить, что отработанные токены из БД надо удалять, чтобы не засорять БД
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData){
            tokenData.refreshToken = refreshToken; // userId не трогаем, а refresh token перезаписываем
            return tokenData.save(); // для обновления в БД refresh token
        }
        // если условие свыше не выполняется, то скорее всего юзер логинится в первыый раз и его записи в БД нет и ее надо создать
        const token = await tokenModel.create({user: userId, refreshToken});
        return token;
    }

    async removeToken(refreshToken) {
        // удаляем refreshToken из БД токен.
        const tokenData = await tokenModel.deleteOne({refreshToken})
        // сама запись с БД при этом также вернется
        return tokenData;
    }

    // поиск токена в БД
    async findToken(refreshToken) {
        // удаляем из БД токен.
        const tokenData = await tokenModel.findOne({refreshToken})
        // сама запись с БД при этом также вернется
        return
    }
}

module.exports = new TokenService();

