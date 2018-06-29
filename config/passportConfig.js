const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db_connection')
const jwt = require('jsonwebtoken')
const keys = require('../keys')
const theKey = keys.passportJwt
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const JwtStrategy = require('passport-jwt').Strategy

// passport config
passport.use(new LocalStrategy(async function (username, password, done) {

    try {
        const user = await db.UserCredData.findOne({username: username})

        if (!user)
            return done(null, false, 'Incorrect username.')

        if (!user.validPassword(password, user.password)) // .validPassword has to be manually defined for the model
            return done(null, false, 'Incorrect password.')

        done(null, user, 'Logged In')
    } catch (e) {
        done(e, null, e)
    }
}))

// jwt (have to include strategy)
passport.logUserIn = function (req, res, user) {

    const token = jwt.sign({
        username: user.username,
        email: user.email,
        timer: !user.timer ? parseInt(Date.now() / 1000) : user.timer
    }, keys.passportJwt)

    // res.locals.token = 'JWT ' + token
    res.cookie('x-token', token)
}

//jwt auth
passport.checkToken = function (req, res, next){

    if (!req.cookies)
        return res.redirect('/user/signupin')

    if (!req.cookies['x-token'])
        return res.redirect('/user/signupin')

    if (req.cookies['x-token'] === 'NA')
        return res.redirect('/user/signupin')

    next()
}

const cookieExtractor = function(req) {

    return req.cookies['x-token']
}

passport.use(new JwtStrategy({

    jwtFromRequest: cookieExtractor,
    secretOrKey: keys.passportJwt
}, function (jwt_payload, done) {

    let iat = jwt_payload.iat
    let exp = iat + 3600 //one hour refresh token
    let start = jwt_payload.timer
    let end = start + 604800 //one week log out
    let now = parseInt(Date.now() / 1000)

    let act = ''

    if (end < now)
        act = 'lo' //logout

    else if (exp < now)
        act = 'rt' //refresh token

    else
        act = 'cont'

    done(null, {jwt_payload, act})
}))

//google oauth
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    db.GoogleUserData.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
        clientID: keys.googleId,
        clientSecret: keys.googleSec,
        callbackURL: "/user/customAuth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {

        db.GoogleUserData.findOne({displayName: profile.displayName + '-g'}, function (err, user) {

            if(user)
                return done(err, user);

            let newUser = new db.GoogleUserData({

                displayName: profile.displayName + '-g'
            })

            newUser.save()
            return done(err, newUser);
        })
    }
))

passport.checkAuth = function (req, res, next) {

    if (!req.session)
        return res.redirect('/user/signupin')

    if (!req.session.passport)
        return res.redirect('/user/signupin')

    if (!req.session.passport.user)
        return res.redirect('/user/signupin')

    let loggedUser = req.session.passport.user
    let urlUser = req.params.user

    db.GoogleUserData.findById(loggedUser, function (err, data) {

        let userName = data.displayName

        if (urlUser !== userName) {

            console.log(urlUser)
            console.log(userName)
            return res.redirect(`/user/customAuth/google/${userName}`)
        }

        next()
    })
}

passport.isLoggedIn = async function (req, res, next){

    if (req.cookies)
        if (req.cookies['x-token'])
            if (req.cookies['x-token'] !== 'NA')
                return res.redirect(`/user/redir;ector`)

    if (req.session)
        if (req.session.passport)
            if (req.session.passport.user)
                return res.redirect(`/user/customAuth/google/redir;ector`)

    next()
}

// checking auth for card details
passport.dataAuth = function(req, res, next){

    let type = 'none'

    if (req.cookies)
        if (req.cookies['x-token'])
            if (req.cookies['x-token'] !== 'NA')
                type = 'token'

    if (req.session)
        if (req.session.passport)
            if (req.session.passport.user)
                type = 'custom'

    res.locals.typeAuth = type

    if (req.method === 'GET') {

        if (type === 'none')
            return res.redirect('/user/signupin')

        if (type === 'token')
            passport.authenticate('jwt', {session: false})(req, res, next)

        if (type === 'custom')
            passport.checkAuth(req, res, next)
    }

    else {

        if (type === 'custom')
            next()

        if (type === 'token')
            passport.authenticate('jwt', {session: false})(req, res, next)
    }
}

passport.checkLogout = function(req, res, next){

    if (res.locals.typeAuth === 'token')
        if (req.user.act === 'lo') {

            if (req.method !== 'GET')
                return res.send({err: 1, mes: 'Log In Again to Continue'})

            return res.redirect('/user/signupin')
        }

    next()
}

module.exports = passport