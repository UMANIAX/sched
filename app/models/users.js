const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({

    email: {

        type: String,
        required: true,
        unique: true,
        trim: true
    },

    username: {

        type: String,
        required: true,
        unique: true,
        trim: true
    },

    accountConf: {

        type: Number,
        required: true,
        default: 0
    },

    recovToken: {

        type: String
    },

    confToken: {

        type: String
    }
})

let UserData = mongoose.model('user', UserSchema)
module.exports = UserData