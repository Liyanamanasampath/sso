const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    client_id:
    {
        type: String,
        unique: true,
        required: true
    },
    client_secret:
    {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        default: false
    },
    redirect_uris: String,
    name: String
}, {
    timestamps: true
})

module.exports = mongoose.model('Client', clientSchema)