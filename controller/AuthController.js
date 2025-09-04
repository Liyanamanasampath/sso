const authService = require('../service/AuthService')

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body)
        res.status(201).json(result)
    } catch (error) {
        next(error);
    }
}

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body)
        res.status(201).json(result)
    } catch (error) {
        next(error);
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const result = await authService.refreshToken(req.body)
        res.status(201).json(result)
    } catch (error) {
        next(error);
    }
}

const validSsoSignIn = async (req, res, next) => {
    try {
        const result = await authService.validSsoSignIn(req.body)
        res.status(201).json(result)
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        const result = await authService.logout(req, res, next)
        res.status(201).json(result)
    } catch (error) {
        next(error);
    }
}

module.exports = {login,register,refreshToken,validSsoSignIn,logout}