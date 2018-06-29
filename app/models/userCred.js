const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const findOrCreate = require('mongoose-findorcreate')

let UserCredSchema = new Schema({

    username: {

        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {

        type: String,
        required: true,
        trim: true
    }
})

// hashing password before saving
UserCredSchema.pre('save', function (next) {

    let user = this

    bcrypt.hash(user.password, 10, function (err, hash) {

        user.password = hash
        next()
    })
})

// verifying passwords via passport local strategy
UserCredSchema.methods.validPassword = function(password, hash){

    return bcrypt.compareSync(password, hash)
}

//plugins
UserCredSchema.plugin(findOrCreate)

let UserCredData = mongoose.model('usercred', UserCredSchema)
module.exports = UserCredData