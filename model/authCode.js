
const mongoose = require('mongoose');

const AuthCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    client_id: String,
    redirect_uri: String,
    userId: String,
    scope: String,
    code_challenge: String,     
    code_challenge_method: String,
    createdAt: { type: Date, default: Date.now, expires: 300 } 
});
module.exports = mongoose.model('AuthCode', AuthCodeSchema);
