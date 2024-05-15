const router = require("express").Router();

const {
  readPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  createCommentPost,
  editCommentPost,
  deleteCommentPost
} = require("../controllers/post.controller");
const { uploadPost } = require("../controllers/upload.controller");

//posts
router.get("/", readPost);
router.post("/", uploadPost.single("file"), createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/like-post/:id", likePost);
router.patch("/unlike-post/:id", unlikePost);

//comments
router.patch("/post-comment/:id", createCommentPost);
router.patch("/edit-post-comment/:id", editCommentPost);
router.patch("/delete-post-comment/:id", deleteCommentPost);

module.exports = router;
