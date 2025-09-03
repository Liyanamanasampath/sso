const Token = require('../model/token')

const isAuthorize = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new createError(401, 'No token provided');
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const dbToken = await Token.findOne({ token, revoked: false });
      if (!dbToken) throw new createError(401, 'Token revoked or not found');
  
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
};
  

const authorize = async () => {
    try {

    } catch (error) {
        throw error;
    }
}

const redirect = async () => {
    try {

    } catch (error) {
        throw error;
    }
}

module.exports = {isAuthorize,authorize,redirect}