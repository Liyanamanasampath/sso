const express = require('express');
const router = express.Router();
const OauthController = require('../controller/OathController')

router.post('/is-authorize',OauthController.isAuthorize)


module.exports = router;