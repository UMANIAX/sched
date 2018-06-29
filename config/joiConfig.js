const joi = require('joi')

// user schema for backend validation with joi
joi.userSchema = joi.object().keys({

    email: joi.string().email().required(),
    username: joi.string().regex(/^[a-zA-Z0-9]{1,30}$/).required(),
    password: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
    passwordConf: joi.any().valid(joi.ref('password')).required()
})

joi.passRecov = joi.object().keys({

    password: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
    cpassword: joi.any().valid(joi.ref('password')).required()
})

module.exports = joi