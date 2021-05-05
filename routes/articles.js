const express = require('express')
const router = express.Router()
const Article = require('../models/article')


router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() }) // because we poputlate the form fields with the data they were previously set to, if we first visit the page for creating a new article, since we have no data to pre-populate the form, we will have an error. So what we will do is to create a new instance of the Article model with empty fields and just pass it to the 'create new article page' so that it will just show empty fields and prevent the error.
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article })
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article === null) res.redirect('/')
    res.render('articles/show', { article })
})

router.post('/', async (req, res, next) => {
    req.article = new Article() // we can create our own properties on the req object and access them later in another handler function or middleware
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id)
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article // we are accessing the property we created on the req object
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
            await article.save()
            res.redirect(`/articles/${article.slug}`)
        }
        catch (err) {
            console.log(err)
            res.render(`articles/${path}`, { article })
        }
    }
}




module.exports = router