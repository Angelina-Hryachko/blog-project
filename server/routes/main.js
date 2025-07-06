const express = require('express')
const router = express.Router()
const Post = require('../models/Post.js')
const UserRequest = require('../models/UserRequest.js')
const insert = require('../const/insertPosts.js')

router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Seach",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
        
        let searchTerm = req.body.searchTerm
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        })

        res.render('search', {
            data, 
            locals,
            currentRoute: '/'
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/post/:id', async (req, res) => {
    try {

        let slug = req.params.id

        const data = await Post.findById({ _id: slug })

        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('post', { 
            locals, 
            data, 
            currentRoute: '/' 
        })
    } catch (e) {
        console.log(e)
    }
})

router.use('/about', (req, res) => {
    const currentRoute = '/about'
    res.render('about', { currentRoute })
})

router.use('/contact', (req, res) => {
    const currentRoute = '/contact'
    res.render('contact', { currentRoute })
})

router.post('/send-message', async (req, res) => {
    const { username, email, message } = req.body

    await UserRequest.create({
        username,
        email,
        message
    })

    res.redirect('/')
})

router.use('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJS Blog",
            description: "Simple Blog."
        }

        const currentRoute = '/'

        let perPage = 7
        let page = req.query.page || 1

        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec()

        const count = await Post.countDocuments({})
        const nextPage = parseInt(page) + 1
        const prevPage = page != 1 ? page - 1 : null
        const hasNextPage = nextPage <= Math.ceil(count / perPage)

        res.render('index', { 
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            prevPage: prevPage,
            currentRoute
         })
    } catch (e) {
        console.log(e)
    }
})


// insert()


module.exports = router