require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const massive = require('massive')
const session = require('express-session')

const app = express();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))


//DATABASE CONNECTION
massive(process.env.CONNECTIONSTRING).then(db => {
    app.set('db', db);
})

let port = 3001;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
}, function(accessToken, refreshToken, extraParams, profile, done){
    console.log(profile)
    const db = app.get('db');

    db.find_user(profile.id).then(user => {
        console.log(user)
        if(user[0]){
            return done(null, user);
        } else {
            db.create_user([profile.displayName, profile.emails[0].value, 
            profile.picture, profile.id]).then(user => {
                return done(null, user[0]);
            })
        }
    })
}))

//THIS IS INVOKED ONE TIME TO SET THINGS UP
passport.serializeUser(function(user, done){
    console.log(user)
    done(null, user)
})

//USER COMES FROM SESSION - THIS IS INVOKED FOR EVERY ENDPOINT
passport.deserializeUser(function(user, done) {
    console.log(user)
    app.get('db').find_session_user(user[0].id).then(user => {
        return done(null, user[0]);
    })
})

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3002/#/private',
    failureRedirect: 'http://localhost:3002/#/'
}))

app.get('/auth/me', (req, res) => {
    if(!user){
        return res.status(404).send('User not found')
    } else{
        res.status(200).send(req.user)
    }
})

app.get('/auth/logout', (req, res) => {
    req.logOut();
    return res.redirect(302, 'http://localhost:3002/#/');
})

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})