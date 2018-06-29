const mongoose = require('mongoose')
const mongoDB = 'mongodb://umaniax:umianu1234@ds261540.mlab.com:61540/scheddb'
mongoose.connect(mongoDB)
mongoose.Promise = Promise

module.exports.CardData = require('../app/models/card')
module.exports.UserData = require('../app/models/users')
module.exports.UserCredData = require('../app/models/userCred')
module.exports.GoogleUserData = require('../app/models/googleUsers')