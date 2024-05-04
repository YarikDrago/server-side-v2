const tokenService = require('../service/token-service')
class TokenController{
    async checkToken(req,res){
        try{
            console.log("check token")
            // console.log("request ", req.cookies)
            const refreshToken = req.cookies.refreshToken
            const accessToken = (req.headers.authorization).split(' ')[1] // bearer token as access token
            console.log("refresh token:", refreshToken)
            console.log("access token:", accessToken)
            // check if access token empty
            if (!accessToken){
                return res.status(200).send({message: 'access token is empty'})
            }
            // verify access token
            const accessTokenVerification = tokenService.validateAccessToken(accessToken)
            if (!accessTokenVerification){
                console.log("access token invalid")
                console.log("try to refresh tokens")
                const refreshTokenVerification = tokenService.validateRefreshToken(refreshToken)
                if (!refreshTokenVerification){
                    return res.status(200).send({message: 'tokens invalid'})
                }
                console.log("refresh token is valid")
                return res.status(200).send({message: 'access token is not valid.', tokenStatus: false})
            }
            console.log("access token is valid")
            return res.status(200).send({message: "access token is valid", tokenStatus: true})
        } catch (e) {
            console.log("check token error")
        }
    }
}

module.exports = new TokenController()
