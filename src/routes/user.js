const router = require("express").Router();

const user = require("../models/user");

const admin = require("../../config/firebase.config");

router.get("/login", async (req, res) => {
  if (!req.headers.authorization) {
    res.status.send({ message: "Invalid Token" });
  }

  const token = req.headers.authorization.split(" ")[1];

  // validte token
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (!decodeValue) {
      return res.status(505).json({ message: "Unauthorized access" });
    } else {
      // Check if user exists or not
      const userExist = await user.findOne({ userId: decodeValue.user_Id });
      if (!userExist) {
        newUserData(decodeValue, req, res);
      } else {
        updateNewUserData(decodeValue, req, res);
      }
    }
  } catch (error) {
    return res.status(505).json({ message: error });
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

const updateNewUserData = async (decodeValue, req, res) => {
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
    res.status(400).send({success: false, message: error})
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
    return res.status(200).send({users: data});
  } else {
    return res.status(400).send({ success: false, msg: "No Users found" });
  }
});

module.exports = router;
