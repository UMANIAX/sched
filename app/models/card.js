const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cardSchema = new Schema({

    title: {type: String, required: true},
    type: {type: String, required:true},
    date: {type: String, required: true},
    time: {type: String, required: true},
    freq: {type: String, required: true},
    urg: {type: String, required: true},
    desc: {type: String, default: ''},
    username: {type: String, required: true, default: 'umaniax'}
})

CardModel = mongoose.model('cards', cardSchema)
module.exports = CardModel