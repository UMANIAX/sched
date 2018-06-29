const express = require('express')
const router = express.Router()
const db = require('../../config/db_connection')
const mongoose = require('mongoose')
mongoose.Promise = Promise
const passport = require('../../config/passportConfig')

router.get('/getData/:user', passport.dataAuth, async function (req, res) {

    if (res.locals.typeAuth === 'token')
        if (req.user.jwt_payload.username !== req.params.user)
            return res.redirect('/notfound')

    let googleAcount = await db.GoogleUserData.findOne({displayName: req.params.user})

    if (!googleAcount) {

        let accountStatus = await db.UserData.findOne({username: req.params.user})

        if (!accountStatus.accountConf)
            return res.send({acc: 'Please Confirm Your Account for Using Sched!', inf: 'Check Spam for E-Mail'})
    }

    let foundData = await db.CardData.find({username: req.params.user})
    res.send(foundData)
})

router.post('/postCard/:user', passport.dataAuth, passport.checkLogout, function (req, res) {

    const postData = new db.CardData(req.body)
    postData.username = req.params.user

    postData.save()

    res.send({mes: 'posted'})
})


router.put('/uptCard', passport.dataAuth, passport.checkLogout, async function (req, res) {

    const putData = req.body
    await db.CardData.findByIdAndUpdate(putData._id, putData)

    res.send({mes: 'updated'})
})

router.delete('/delCard/:id', passport.dataAuth, passport.checkLogout, async function (req, res) {

    const delData = req.params.id

    db.CardData.findByIdAndDelete(delData)
        .then(() => res.send({mes: 'delete'}))
})

// router.get('/makeCardUpdations', async function (req, res) {
//
//     let cardData = await db.CardData.find()
//     cardData.forEach(item => {
//
//         // item.cid = 1
//         console.log(item.cid)
//         item.save()
//     })
//
//
//     res.send('Done')
// // })

module.exports = router