const express = require('express')
const app = express()
const keys = require('./keys')

// other npm modules
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const session = require('express-session')

// all routes
const cardRoute = require('./app/routes/card')
const userRoute = require('./app/routes/users')

// setting up mvc
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname + '/views'))
app.use(express.static(path.join(__dirname + '/public')))

// some middlleware
app.use(bodyParser.urlencoded({extended: false})) // get information from html forms
app.use(cookieParser())
app.use(session({
    secret: keys.sessions,
    cookie: { maxAge: 60 * 60 * 1000 }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
}); // This middleware snippet help to reload the website on pressing back button rather than showing cached copy

// port
app.listen(process.env.PORT || 3000)

// routes
app.use('/card', cardRoute)
app.use('/user', userRoute)

app.get('/', async function (req, res) {

    res.render('base')
})

app.get('*', function (req, res) {

    res.render('bullshitQuery')
})