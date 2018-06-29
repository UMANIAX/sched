const mongoose = require('mongoose')
const Schema = mongoose.Schema

let GoogleUserSchema = new Schema({

    displayName: {

        type: String,
        unique: true,
        required: true,
        trim: true
    }
})

let GoogleUserModel = mongoose.model('googleuser', GoogleUserSchema)
module.exports = GoogleUserModel