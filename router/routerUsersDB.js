const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const tokenController = require('../controllers/token-controller');
const router = new Router();
const {body} = require('express-validator');
const middlewareAuth = require('../middlewares/auth-middleware');

router.post('/registration',
    body('email').isEmail(), // проверяем поле Email на корректность
    body('password').isLength({min:4}),
    userController.registration
    );
router.get('/activate/:link', userController.activate);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
// router.get('/users', userController.getUsers)
router.get('/users', middlewareAuth, userController.getUsers);

router.post('/checktoken' , tokenController.checkToken);

module.exports = router;
