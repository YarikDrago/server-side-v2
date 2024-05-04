module.exports = function (req, res, next){
    try{
        console.log("middleware auth check")
        const authorizationHeader = req.headers.authorization;
        console.log('here')
        console.log("auth header:", authorizationHeader)
        if (!authorizationHeader){
            return res.status(200).send({message: 'Empty token. User must login'})
        }
        next()
    } catch (e) {
        console.log('middleware auth error')
    }
}
