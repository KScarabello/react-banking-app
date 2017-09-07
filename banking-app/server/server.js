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


app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})