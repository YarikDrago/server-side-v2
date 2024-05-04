const Router = require('express').Router;
const router = new Router();
const commonController = require('../controllers/common-controller')

router.get('/test', commonController.test)
router.get('/users', commonController.getUsers)
router.get("/login", commonController.login)
router.post('/send_email', commonController.sendEmailMessage)

module.exports = router
