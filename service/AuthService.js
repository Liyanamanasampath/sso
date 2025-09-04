const User = require('../model/user');
const AuthCode = require('../model/authCode')
const Token = require('../model/token')
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const mongoose = require('mongoose');

const login = async (data) => {
    try {
        const user = await User.findOne({ email: data?.email });
        if (!user) {
            throw new createError(404, 'user not found')
        }
        const token = jwt.sign(
            { email: user.email, id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const refreshToken = await generateRefreshToken(user.id);
        await User.findByIdAndUpdate(user.id, { refreshToken });

        await Token.create({
            userId: user.id,
            token: token,
            type: 'access',
            expiresAt: new Date(Date.now() + 1000),
        });

        await Token.create({
            userId: user.id,
            token: refreshToken,
            type: 'refresh',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        const ssoCode = new mongoose.Types.ObjectId().toString();
        await AuthCode.create({
            code: ssoCode,
            client_id: data?.client_id ?? null,
            redirect_uri: data?.redirect_uri ?? null,
            userId: user.id,
        });
        return {
            access_token: token,
            refresh_token: refreshToken,
            token_type: 'Bearer',
            sso_code: ssoCode,
            user: {
                id: user.id,
                name: user.firstname,
                email: user.email,
            },
        };

    } catch (error) {
        throw error;
    }
}

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const register = async (body) => {
    try {
        const { email, password, surname, name } = body
        const user = await User.findOne({ email });
        if (user) {
            throw new createError(400, 'user alredy exist')
        }

        const newUser = await User.create({ email, password, surname, name });
        return newUser;
    } catch (error) {
        throw error;
    }
}

const refreshToken = async (body) => {
    try {
        const oldRefreshToken = body?.refresh_token;
        const userToken = await Token.findOne({ token: oldRefreshToken, type: 'refresh' });
        if (!userToken) {
            throw new createError(401, 'Invalid refresh token');
        }

        const user = await User.findById(userToken.userId);
        if (!user) {
            throw new createError(404, 'User not found');
        }
        // const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET); // verify and throw error
        const decoded = jwt.decode(body?.refresh_token);
        if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
            throw new createError(401, "Refresh token expired");
        }

        const newAccessToken = jwt.sign(
            { id: decoded.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const token = generateRefreshToken(user.id);
        await Token.findOneAndDelete({ token: oldRefreshToken, type: 'refresh' });

        await Token.create({
            userId: user.id,
            token: token,
            type: 'refresh',
            expiresAt: new Date(Date.now() + 1000),
        });

        await Token.create({
            userId: user.id,
            token: newAccessToken,
            type: 'access',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return {
            access_token: newAccessToken,
            refresh_token: token,
            token_type: 'Bearer',
            user: {
                id: user.id,
                name: user.firstname,
                email: user.email,
            },
        };

    } catch (error) {
        throw error;
    }
}

const validSsoSignIn = async (body) => {
    const { ssoCode, client_id } = body;

    const authCode = await AuthCode.findOne({ code: ssoCode });
    if (!authCode) throw new createError(400, "Invalid or expired SSO code");

    const user = await User.findById(authCode.userId);
    if (!user) throw new createError(404, "User not found");

    // Issue tokens
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    const refreshToken = generateRefreshToken(user.id);

    user.refresh_token = refreshToken;
    await user.save();


    await AuthCode.deleteOne({ _id: authCode._id });

    await Token.create({
        userId: user.id,
        token: accessToken,
        type: 'access',
        expiresAt: new Date(Date.now() + 1000),
    });

    await Token.create({
        userId: user.id,
        token: refreshToken,
        type: 'refresh',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        user: {
            id: user.id,
            email: user.email,
        }
    };
};


const logout = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await Token.updateMany(
            { userId : decoded?.id },
            { $set: { revoked: true } }
        );
        return { message: "User logged out from all apps" };

    } catch (error) {
        throw error;
    }
};

module.exports = { login, register, refreshToken, validSsoSignIn, logout }