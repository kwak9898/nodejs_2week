const express = require("express");
const Comment = require('../schemas/comment');
const router = express.Router();
const userMiddleware = require("../middlewares/middle");

router.get("/comment/:postId", async (req, res) => { 
    const { postId } = req.params;

    const comment = await Comment.find({ postId: postId }).sort("-commentId");  // 여러사람이 댓글을 달 수 있으니까 findOne -> find
    // console.log(comment)
    res.json({ comment: comment });
});

router.post("/comment", userMiddleware, async (req, res) => {
    try {
        const { user } = res.locals;
        
        let newcomment = await Comment.find().sort("-commentId");
        let commentId = 1
        
        if (newcomment.length !== 0) {
          commentId = newcomment[0]["commentId"] +1;      
        }

        await Comment.create({
            commentId: commentId,
            postId: req.body.postId,
            comment: req.body.comment,
            name: user.username,
        });
        res.send({ result: "success" })
    } catch (err) {
        console.log("----------------------------")
        console.log("에러다" + err)
        res.redirect("/main")
    }
})

router.patch("/comment/:commentId", userMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { user } = res.locals;
    const { comment, name } = req.body;
    console.log(comment, name, user.username)
  
    // const comments = await Comment.findOne({ commentId: commentId });
    if (name === user.username) {
      await Comment.updateOne({ commentId: commentId }, {$set: { comment: comment } }); //db의 필드값: req.body
      res.send({ result: "success" });
    } else {
      res.send({ result: "fail" });
    }
  });

router.delete("/comment/:commentId", userMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { user } = res.locals;
    const{ name } = req.body
  
    // const comment = await Comment.findOne({ commentId: commentId, name: name });
    if (name === user.username) {
      await Comment.deleteOne({ commentId: commentId })
      res.send({ result: "success" })
    } else {
      res.send({ result: "fail" })
    }
  });

module.exports = router;



// 코멘트와 포스트 구분
// postid 써준 이유는 GET을 통해서, 조회 목록을 코멘트 포함해서 가져오기 위함
// commentId는 코멘트 각각의 코멘트를 가져오기 위해서 