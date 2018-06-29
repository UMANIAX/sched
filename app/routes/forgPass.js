const express = require('express')
const router = express.Router()

// recovery tools
const joi = require('../../config/joiConfig')
const passport = require('../../config/passportConfig')
const nodeMailer = require('../../config/nodeMailerConfig')
const hash = require('object-hash')

// User db
const db = require('../../config/db_connection')

router.post('/forgPass', function (req, res) {

    let recMail = req.body.recovEmail

    db.UserData.findOne({email: recMail}, function (err, data) {

        if (!data)
            return res.send({err: 1})

        let token = hash(Math.random().toString(36))

        data.recovToken = token
        data.save()

        // nodeMailer.mailOptions.to = recMail
        // nodeMailer.mailOptions.subject = 'Password Recovery'
        // nodeMailer.mailOptions.text = `Go to the following link for recovery: -\nhttps://whispering-earth-53895.herokuapp.com/user/passRecov/${token}`
        // nodeMailer.transporter.sendMail(nodeMailer.mailOptions)

        let sendText = `Go to the following link for recovery: -\nhttp://schedapp.herokuapp.com/user/passRecov/${token}`
        nodeMailer.sendMail(recMail, sendText, 'Password Recovery')

        res.send()
    })

})

router.get('/:recovToken', async function (req, res) {

    let token = req.params.recovToken
    let userData = await db.UserData.findOne({recovToken: token})

    if (!userData)
        return res.redirect('/user/signupin')

    res.render('userReger/recoveryPass', {token: token})
})

router.post('/newPass/:recovToken', function (req, res) {

    let passData = req.body

    let token = req.params.recovToken

    const result = joi.validate(passData, joi.passRecov)

    if (result.error)
        return res.send({err: 1})

    db.UserData.findOne({recovToken: token}, function (err, data) {

        data.recovToken = undefined
        data.save()

        db.UserCredData.findOne({username: data.username}, function (err, credData) {

            credData.password = result.value.password
            credData.save()

            res.send({redirect: `/user/${credData.username}`})
        })
    })
})

module.exports = router