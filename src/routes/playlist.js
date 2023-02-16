const router = require("express").Router();

const playlist = require("../models/playlist");

router.get("/", async (req, res) => {
  const options = {
    sort: {
      createdAt: 1,
    },
  };

  const data = await playlist.find(options);

  if (data) {
    return res.status(200).send({ data: data });
  } else {
    return res.status(400).send({ success: false, msg: "No Playlists found" });
  }
});

router.get("/:id", async (req, res) => {
  const filter = { _id: req.params.id };

  const data = await playlist.findOne(filter);

  if (data) {
    return res.status(200).send({ success: true, playlist: data });
  } else {
    return res.status(400).send({ success: false, msg: "Playlist not found" });
  }
});

router.post("/", async (req, res) => {
  const newPlaylist = song({
    name: req.body.name,
    songs: req.body.songs,
  });

  try {
    const savedPlaylist = await newPlaylist.save();
    return res.status(200).send({ success: true, song: savedPlaylist });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error });
  }
});

router.put("/:id", async (req, res) => {
  const filter = { _id: req.params.id };

  const options = {
    upsert: true,
    new: true,
  };

  try {
    const result = await playlist.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        songs: req.body.songs,
      },
      options
    );
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error });
  }
});

router.delete("/:id", async (req, res) => {
  const filter = { _id: req.params.id };

  result = await playlist.deleteOne(filter);
  if (result) {
    return res.status(200).send({ success: true, msg: "Playlist deleted" });
  } else {
    return res.status(400).send({ success: false, msg: "Playlist not found" });
  }
});

module.exports = router;
