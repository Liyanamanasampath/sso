const express = require('express');
const router = express.Router();
const AuthController = require('../controller/AuthController')

router.post('/login',AuthController.login)
router.post('/register',AuthController.login)
router.post('/refresh-token',AuthController.refreshToken)
router.post('/validate-sso',AuthController.validSsoSignIn)
router.post('/login',AuthController.logout)


module.exports = router;