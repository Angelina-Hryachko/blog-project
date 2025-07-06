const express = require('express')
const router = express.Router()

const errorLayout = '../views/layout/error'

router.get('/error', (req, res) => {
    const { status, msg } = req.query

    console.log(req.query)
    const locals = {
        title: "Error",
        description: "Simple Blog created with NodeJs, Express & MongoDb.",
        status,
        msg
    }


    res.render('error', { locals, layout: errorLayout })
})

module.exports = router