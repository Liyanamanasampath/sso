const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    refresh_token: {
        type: String,
        required: false,
    },
    pwd_reset_token: {
        type: String,
        required: false,
    },
    reset_token_exp_at: {
        type: Number,
        required: false,
    },
}, {
    timestamps: true
})

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.method.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.virtual('fullName').get(function () {
    return this.name + ' ' + this.surname;
})
module.exports = mongoose.model('User', userSchema);