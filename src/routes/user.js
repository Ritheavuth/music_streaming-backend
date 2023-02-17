const router = require("express").Router();

const user = require("../models/user");

const admin = require("../../config/firebase.config");

router.get("/login", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ message: "Invalid Token" });
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (!decodeValue) {
      return res.status(500).json({ message: "Un Authorize" });
    }
    // checking user email already exists or not
    const userExists = await user.findOne({ user_id: decodeValue.user_id });
    if (!userExists) {
      newUserData(decodeValue, req, res);
    } else {
      updateUserData(decodeValue, req, res);
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

const newUserData = async (decodeValue, req, res) => {
  const newUser = new user({
    name: decodeValue.name,
    email: decodeValue.email,
    imageURL: decodeValue.picture,
    user_id: decodeValue.user_id,
    email_verified: decodeValue.email_verified,
    role: "member",
    auth_time: decodeValue.auth_time,
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).send({ user: savedUser });
  } catch (error) {
    res.status(400).send({ success: false, message: error });
  }
};

const updateUserData = async (decodeValue, req, res) => {
  const filter = { user_id: decodeValue.user_id };
  const options = {
    upsert: true,
    new: true,
  };

  try {
    const result = await user.findOneAndUpdate(
      filter,
      { auth_time: decodeValue.auth_time },
      options
    );
    res.status(200).send({ user: result });
  } catch (error) {
    res.status(400).send({ success: false, message: error });
  }
};

router.get("/", async (req, res) => {
  const options = {
    sort: {
      createdAt: 1,
    },
  };

  const data = await user.find(options);

  if (data) {
    return res.status(200).send({ data: data });
  } else {
    return res.status(400).send({ success: false, msg: "No Users found" });
  }
});

router.put("/:id", async (req, res) => {
  const filter = { _id: req.params.id };

  const likedSongs = req.body.data.likedSongs;
  const playlists = req.body.data.playlists;
  const role = req.body.data.role;

  try {
    const result = await user.findOneAndUpdate(filter, {
      role: role,
      playlists: playlists,
      likedSongs: likedSongs,
    });
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error });
  }
});

router.delete("/:id", async (req, res) => {
  const filter = { _id: req.params.id };

  const result = await user.deleteOne(filter);
  if (result) {
    return res.status(200).send({ success: true, msg: "User deleted" });
  } else {
    return res.status(400).send({ success: false, msg: "User not found" });
  }
});

module.exports = router;
