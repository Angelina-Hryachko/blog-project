require('dotenv').config()

const express = require('express')
const expressLayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStrore = require('connect-mongo')

const connectDB = require('./server/config/db.js')
const { isActiveRoute } = require('./server/helpers/routeHelpers.js')
// const { MONGODB_URI, JWT_SECRET } = require('./server/const/const.js')
const MONGODB_URI = process.env.MONGODB_URI 
console.log(process.env)

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(express.urlencoded( { extended: true } ))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'))

app.use(session({
    secret: 'keybord cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStrore.create({
        mongoUrl: MONGODB_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
}))

const main = require('./server/routes/main.js')
const admin = require('./server/routes/admin.js')
const error = require('./server/routes/error.js')

app.use(express.static('public'))

app.use(expressLayout)
app.set('layout', './layout/main')
app.set('view engine', 'ejs')

app.locals.isActiveRoute = isActiveRoute

app.use('/', admin)
app.use('/', error)
app.use('/', main)


app.listen(PORT, () => console.log(`App listening on post ${PORT}`))