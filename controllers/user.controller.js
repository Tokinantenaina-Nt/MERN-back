const mongoose = require("mongoose");
const ObjectID = mongoose.Types.ObjectId;
const UserModel = require("../models/user.model");

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.json(users);
};

module.exports.userInfo = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id))
      return res.status(404).send("ID inconnu : " + req.params.id);

    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send("Utilisateur non trouvé");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.updateUser = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id))
      return res.status(404).send("ID inconnu : " + req.params.id);

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { bio: req.body.bio } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!updatedUser) return res.status(404).send("Utilisateur non trouvé");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("ID inconnu : " + req.params.id);
  try {
    await UserModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "successfully deleted. " });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(404).send("ID inconnu");
  try {
    //ajout a la liste des personnes suivies
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { following: req.body.idToFollow }
      },
      { new: true, upsert: true }
    );

    //ajout a la liste des followers
    const followedUser = await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $addToSet: { followers: req.params.id }
      },
      { new: true, upsert: true }
    );
    res.status(201).json({ user, followedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports.unfollow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("ID inconnu : " + req.params.id);
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true }
    );
    const unfollowedUser = await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true }
    );
    res.status(201).json({ user, unfollowedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports.setPicturesUrl = async (req, res) => {
  let fileName = req.body.name + ".jpg";
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: "./uploads/profil/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send({ message: err });
  }
  fileName = "";
};
