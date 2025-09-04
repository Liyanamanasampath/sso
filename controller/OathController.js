const oauthService = require('../service/OauthService') 

const isAuthorize = async (req, res, next) => {
    try {
        await oauthService.isAuthorize(req, res, next);
    } catch (error) {
       next(error)
    }
}

const authorize = async () => {
    try {
        await oauthService.authorize();
    } catch (error) {
        throw error;
    }
}

const redirect = async () => {
    try {
        await oauthService.redirect();
    } catch (error) {
        throw error;
    }
}

module.exports = {isAuthorize,authorize,redirect}