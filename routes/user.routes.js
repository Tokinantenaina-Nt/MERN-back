const router = require("express").Router();
const { signUp, signIn, logout } = require("../controllers/auth.controller");
const {
  getAllUsers,
  userInfo,
  updateUser,
  deleteUser,
  follow,
  unfollow,
  setPicturesUrl
} = require("../controllers/user.controller");
const { uploadUser } = require("../controllers/upload.controller");
router.post("/register", signUp);
router.post("/login", signIn);
router.get("/logout", logout);

//user DB
router.get("/", getAllUsers);
router.get("/:id", userInfo);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/follow/:id", follow);
router.patch("/unfollow/:id", unfollow);

router.post("/upload", uploadUser.single("file"), setPicturesUrl);

module.exports = router;
