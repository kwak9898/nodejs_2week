const express = require('express')
const app = express()
const Posts = require('./schemas/posts')
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const connect = require("./schemas/index");
connect();

const postsRouter = require("./routers/posts");
app.use("/api", [postsRouter]);

const UserRouter = require('./routers/users');
app.use("/api", UserRouter);

const CommentRouter = require('./routers/comment');
app.use("/api", CommentRouter);

app.get('/main', async (req, res) => {
    const posts = await Posts.find();
    res.render('main', { posts: posts })
});

app.get('/content', (req, res) => {
    res.render('content')
});

app.get('/write', (req, res) => {
    res.render('write')
});

app.get('/update', (req, res) => {
    res.render('update')
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})