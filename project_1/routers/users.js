const express = require("express");
const Users = require('../schemas/users')
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middlewares/middle");

const router = express.Router();

const postUsersSchema = Joi.object({ 
  username: Joi.string().alphanum().min(3).max(30).required(), 
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,30}$")).required(), 
  confirm: Joi.string().required(), 
})

router.post("/users", async (req, res) => {
    try {
        const { username, password, confirm } = await postUsersSchema.validateAsync(req.body);
    
        if (password !== confirm) {
          res.status(400).send({
            errorMessage: "비밀번호가 일치하지 않습니다.",
          });
          return;
        } else if (username === password) {
          res.status(400).send({
            errorMessage: "아이디와 비밀번호를 다르게 해주세요."
          });
          return;
        }
    
        const existUsers = await Users.find({username});
        if (existUsers.length) {
          res.status(400).send({
            errorMessage: "이미 가입된 아이디가 있습니다.",
          });
          return;
        }
    
        const user = new Users({ username, password });
        await user.save();
    
        res.status(201).send({});
      } catch (err) {
        console.log(err);
        res.status(400).send({
          errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
        });
      }
    });

    const postLoginSchema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(), 
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,30}$")).required(), 
    });

    router.post("/login", async (req, res) => {
      try {
        const { username, password } = await postLoginSchema.validateAsync(req.body);
    
        const user = await Users.findOne({ username, password }).exec();
    
        if (!user) {
          res.status(400).send({
            errorMessage: "아이디 또는 패스워드가 잘못됐습니다.",
          });
          return;
        }
    
        const token = jwt.sign({ userId: user.userId }, "my-secret-key");
        res.send({
          token,
        });
      } catch (err) {
          console.log(err);
        res.status(400).send({
          errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
        });
      }
    });

    router.get("/users/me", userMiddleware, async (req, res) => {
      const { user } = res.locals;
      res.send({
        user,
      });
    });

module.exports = router;