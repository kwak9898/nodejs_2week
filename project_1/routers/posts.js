const express = require("express");
const Posts = require('../schemas/posts');
const Users = require('../schemas/users')
const Comments = require('../schemas/comment')
const router = express.Router();
const userMiddleware = require("../middlewares/middle");

router.get("/posts", async (req, res, next) => {
    try {
        const { date } = req.query;
        // console.log(date)
        const posts = await Posts.find({ date }).sort("-date");
        // console.log(posts)
        res.json({ posts: posts });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/posts/:postId", async (req, res) => { 
    const { postId } = req.params;
    // console.log(postId);
    const posts = await Posts.findOne({ postId: postId });
    // console.log(posts)
    res.json({ posts: posts });
});

router.post("/posts", userMiddleware, async (req, res) => {
    try {
        const { user } = res.locals;
        let newpost = await Posts.find().sort("-postId");
        let postId = 1

        if (newpost.length !== 0) {
          postId = newpost[0]["postId"] +1;      
        }
        await Posts.create({
            postId: postId,
            title: req.body.title,
            content: req.body.content,
            name: user.username,
            password: req.body.password
        });
        res.send({ result: "success" })
    } catch (err) {
        console.log("----------------------------")
        console.log("에러다" + err)
        res.redirect("/")
    }
})

router.get("/check/:postId", userMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { user } = res.locals;

  const check = await Posts.findOne({ postId: postId });

  if (check.name !== user.username) {
    res.send({ result: "fail" })
  } else {
    res.send({ result: "success" })
  }
});

router.patch("/posts/:postId", userMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { name, password, title, content} = req.body;
  
    const posts = await Posts.findOne({ postId: postId, password: password});
    console.log(posts)
    if (posts) {
      await Posts.updateOne({ postId }, {$set: { name: name, title: title, content: content } }); //db의 필드값: req.body
      res.send({ result: "success" });
    } else {
      res.send({ result: "fail" });
    }
  });

  router.delete("/posts/:postId", userMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;
  
    const posts = await Posts.findOne({ postId: postId, password: password });
    const comment = await Comments.findOne({ postId: postId })
    if (posts) {
      await Posts.deleteOne({ postId: postId })
      await Comments.deleteMany({postId: postId})
      res.send({ result: "success" })
    }  else {
      res.send({ result: "fail" })
    }
  })

module.exports = router;