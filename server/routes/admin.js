const express = require('express')
const router = express.Router()
const Post = require('../models/Post.js')
const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layout/admin'
const JWT_SECRET = process.env.JWT_SECRET
// const { MONGODB_URI, JWT_SECRET } = require('../const/const.js')

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
       return res.status(401).redirect('/error?status=401&msg=Unauthorized')
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (e) {
        res.status(401).redirect('/error?status=401&msg=Unauthorized')
    }
}

router.get('/admin', async (req, res) => {
    const locals = {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    res.render('admin/index', { locals, layout: adminLayout })
})

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body
    
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(401).redirect('/error?status=401&msg=Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).redirect('/error?status=401&msg=Invalid credentials')
        }

        const token = jwt.sign( {userId: user._id }, JWT_SECRET)
        res.cookie('token', token, { httpOnly: true })
        res.redirect('/dashboard')
    } catch (e) {
        console.log(e)
    }
})

router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
         }

        const data = await Post.find()

        let perPage = 7
        const page = req.query.page || 1

        const datas = await Post.aggregate( [ { $sort: { createdAt: -1 } } ] )
                .skip(perPage * page - perPage)
                .limit(perPage)
                .exec()

        const count = await Post.countDocuments({})        
        const nextPage = parseInt(page) + 1
        const prevPage = page != 1 ? page - 1 : null
        const hasNextPage = nextPage <= Math.ceil(count / perPage)        

        res.render('admin/dashboard', {
            locals,
            data,
            datas,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            prevPage: prevPage,
            layout: adminLayout
        })

    } catch (e) {
        console.log(e)
    }
})

router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }

        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        })

    } catch (e) {
        console.log(e)
    }
})

router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        try {
            await Post.create( {
                title: req.body.title,
                body: req.body.body
            } )
            res.redirect('/dashboard')
        } catch (e) {
            console.log(e)
        }
    } catch (e) {
        console.log(e)
    }
})

router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Free NodeJs User Management System",
        }

        const data = await Post.findOne({ _id: req.params.id })

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })
    } catch(e) {
        console.log(e)
    }
})

router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        })

        res.redirect(`/edit-post/${req.params.id}`)

    } catch (e) {
        console.log(e)
    }
})

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (e) {
        console.log(e)
    }
})

router.get('/register', async (req, res) => {
    const locals = {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    res.render('admin/register.ejs', { locals, layout: adminLayout })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
                       
    // res.json({ message: 'Logout successful' })
    
    res.redirect('/')
})

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        try {
            const user = await User.create({ username, password: hashedPassword })
            res.status(201).redirect('/admin')
        } catch (e) {
                if (e.code === 11000) {
                    res.status(409).redirect('/error?status=409&msg=User already in use')
                }
            res.status(500).redirect('/error?status=500&msg=Internal server error')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router