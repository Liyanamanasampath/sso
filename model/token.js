const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,    
  type: { type: String, enum: ['access', 'refresh'] },
  revoked: { type: Boolean, default: false },
  expiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Token', TokenSchema);
