const mongoose = require("mongoose");

const { Schema } = mongoose;
const postsSchema = new Schema({
    postId: {
        type: Number
    },
    name: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    password: {
        type: String || Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Posts", postsSchema);