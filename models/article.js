const mongoose = require('mongoose')
const marked = require('marked') // 3rd party library to convert markdown syntax to HTML
const slugify = require('slugify') // create id's for individual items/blogs/pages and prevent having ugly routes with long id's
const createDomPurify = require('dompurify') // library for sanitizing html and removing malicious code. It works together with the 'jsdom' library
const { JSDOM } = require('jsdom') // library to help us render HTML in node.js
const dompurify = createDomPurify(new JSDOM().window) // we create a new instance of the DOM and get the window object. We will use this in sanitizing our HTML

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHTML: {
        type: String,
        required: true
    }
})
 // mongoose hook to create slug and sanitize HTML generated from the markdown

articleSchema.pre('validate', function(next) {
    if (this.title) { // the this keyword here references the local instance of the model object. This hook is run before validating the fields of the object
        this.slug = slugify(this.title, { lower: true, 
        strict: true })
    }
    if(this.markdown) {
        this.sanitizedHTML = dompurify.sanitize(marked(this.markdown))
    }
    next()
})


const Article = mongoose.model('Article', articleSchema)

module.exports = Article