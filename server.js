const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override') // this 3rd party library helps us to override the default method of our forms(which is GET/POST) so that we can perform other requests like DELETE, PUT OR PATCH ETC.
const app = express()

const connectDB = async () => {
    const dbURI = 'mongodb+srv://tonygrace:Tonyadjei2402@nodejs.4fw0l.mongodb.net/markdownblog?retryWrites=true&w=majority'
    try {
        const conn = await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(5000) // listen for requests after successfully connection to the database
        console.log(`MongoDB connected successfully: ${conn.connection.host}`)
    }
    catch (err) {
        console.log(err)
    }
   
}
connectDB()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false })) // this parses the data coming from the inputs of a form into a javascript object and places it on the req.body 
app.use(methodOverride('_method')) // we will use '_method' as a variable inside the URL of a form's action attribute when we are making requests to the server. We can indicate what kind of method we want to perform, e.g. action="/articles/<%= article._id %>?_method=DELETE". Now we will still have to give our form a method attribute, just so it has a default method, .e.g method="POST", now this will then be overriden by the '_method=DELETE' and hence, our request to the server will now be a DELETE request.

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles })
})
app.use('/articles', articleRouter) // don't forget to place your routes below important middlware that must come first 



