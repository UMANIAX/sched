const express = require('express')
const router = express.Router()

// auth and valid
const joi = require('../../config/joiConfig')
const passport = require('../../config/passportConfig')
const nodeMailer = require('../../config/nodeMailerConfig')
const hash = require('object-hash')

// User db
const db = require('../../config/db_connection')

// routes
const recovPass = require('./forgPass')
const customAuth = require('./customAuth')

router.use('/passRecov', recovPass)
router.use('/customAuth', customAuth)

router.get('/signupin', passport.isLoggedIn, function (req, res) {

    res.render('userReger/signupin')
})

router.post('/signupPost', async function (req, res) {

    let dataPost = req.body

    try {

        const result = joi.validate(dataPost, joi.userSchema)

        if (result.error)
            return res.send({err: 1, mes: 'validation error'})

        const userEmail = await db.UserData.findOne({'email': result.value.email})
        let userUsername = await db.UserData.findOne({'username': result.value.username})

        if (userEmail || userUsername) {

            res.send({err: 1, mes: 'email/username taken'})
            return
        }

        delete result.value.passwordConf

        let credPost = new db.UserCredData({
            username: result.value.username,
            password: result.value.password
        })

        credPost.save()

        delete result.value.password

        let dbPost = new db.UserData(result.value)
        dbPost.accountConf = 0

        let token = hash(Math.random().toString(36))

        dbPost.confToken = token
        dbPost.save()

        // nodeMailer.mailOptions.to = result.value.email
        // nodeMailer.mailOptions.text = `Go to the following link to confirm account!\nhttps://whispering-earth-53895.herokuapp.com/user/accountConf/${token}`
        // nodeMailer.transporter.sendMail(nodeMailer.mailOptions)

        let sendText = `Go to the following link to confirm account!\nhttp://schedapp.herokuapp.com/user/accountConf/${token}`
        nodeMailer.sendMail(result.value.email, sendText, 'Account Confirmation with Sched')

        passport.logUserIn(req, res, dbPost)
        return res.send({redirect: `/user/${result.value.username}`})

    } catch (e) {

        console.log(e)
    }
})

router.post('/loginPost', function (req, res) {

    passport.authenticate('local', {session: false}, function (err, user, info) {

        if (err || !user)
            return res.send({err: 1, mes: info})

        passport.logUserIn(req, res, user)
        return res.send({redirect: `/user/${user.username}`})

    })(req, res)
})

router.get('/:user', passport.checkToken, passport.authenticate('jwt', { session: false }), function (req, res) {

    let logUser = req.user.jwt_payload.username

    if (req.user.act === 'lo') {

        res.cookie('x-token', 'NA')
        return res.redirect(`/user/signupin`)
    }

    if (req.user.act === 'rt')
        passport.logUserIn(req, res, req.user.jwt_payload)

    if (logUser !== req.params.user)
        return res.redirect(`/user/${logUser}`)

    return res.render('homePage/home', {username: req.params.user})
})

router.post('/logout', function (req, res) {

    if (req.cookies)
        res.cookie('x-token', 'NA')

    if (req.session)
        req.session.destroy()

    res.send('/user/signupin')
})

router.get('/accountConf/:confToken', async function (req, res) {

    let token = req.params.confToken

    db.UserData.findOne({confToken: token}, function (err, data) {

        if (err)
            return res.send(err)

        if (!data)
            return res.redirect('/user/signupin')

        data.accountConf = 1
        data.confToken = undefined
        data.save()

        res.redirect(`/user/${data.username}`)
    })
})

module.exports = router