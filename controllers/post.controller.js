const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const { fileName } = require("./upload.controller");

module.exports.readPost = (req, res) => {
  PostModel.find()
    .sort({ createdAt: -1 })
    .then(docs => {
      res.send(docs);
    })
    .catch(err => {
      console.error("Error fetching data: ", err);
      res.status(500).send("Error fetching data");
    });
};

module.exports.createPost = async (req, res) => {
  console.log("gfileS ,", fileName(req).fileNamePathPost);
  const newPost = await new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: "./uploads/posts/" + fileName(req).fileNamePathPost,
    video: req.body.video,
    likers: [],
    comments: []
  });
  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("ID inconnu : " + req.params.id);

  const updatedRecord = { message: req.body.message };
  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord },
      { new: true }
    );
    res.send(updatedPost);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du message :", err);
    res
      .status(500)
      .send({ message: "Erreur lors de la mise à jour du message" });
  }
};
module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("ID inconnu : " + req.params.id);

  try {
    await PostModel.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Suppression réussie" });
  } catch (error) {
    console.error("Erreur lors de la suppression du post :", error);
    res.status(500).send({ message: "Erreur lors de la suppression du post" });
  }
};
module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("ID inconnu : " + req.params.id);
  try {
    const likedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id }
      },
      { new: true }
    );
    const likerPost = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id }
      },
      { new: true }
    ).select("-password");
    res.json({ likedPost, likerPost });
  } catch (err) {
    res.status(400).send(err);
  }
};
module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("ID inconnu : " + req.params.id);

  try {
    const unlikedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.id } },
      { new: true }
    );

    const unlikerUser = await UserModel.findByIdAndUpdate(
      req.body.id,
      { $pull: { likes: req.params.id } },
      { new: true }
    ).select("-password");

    res.json({ unlikedPost, unlikerUser });
  } catch (err) {
    res.status(400).send(err);
  }
};
module.exports.createCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("ID inconnu : " + req.params.id);
  try {
    const newCommentPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime()
          }
        }
      },
      { new: true }
    );
    res.send({ newCommentPost });
  } catch (err) {
    res.status(400).send(err);
  }
};
module.exports.editCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send({ message: "ID inconnu " });

  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).send({ message: "Post not found" });

    const comment = post.comments.find(comment =>
      comment._id.equals(req.body.commentId)
    );
    if (!comment) return res.status(404).send({ message: "Comment not found" });

    comment.text = req.body.text;
    await post.save();

    return res.status(200).send(post);
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send({ message: "ID inconnu" });
  try {
    await PostModel.findByIdAndUpdate(req.params.id, {
      $pull: { comments: { _id: req.body.commentId } }
    });
    res.send({ message: "deleted succesfully" });
  } catch (err) {
    return res.status(500).send(err);
  }
};
