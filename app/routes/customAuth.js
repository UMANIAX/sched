const express = require('express')
const router = express.Router()

//auth middleware
const passport = require('../../config/passportConfig')
const db = require('../../config/db_connection')

//Google Auth
router.get('/google', passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'}))

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/user/signupin'}), async function (req, res) {

    let userId = req.session.passport.user
    let user = await db.GoogleUserData.findById(userId)

    res.redirect(`/user/customAuth/google/${user.displayName}`)
})

router.get('/google/:user', passport.checkAuth, function (req, res) {

    return res.render('homePage/home', {username: req.params.user})
})

module.exports = router