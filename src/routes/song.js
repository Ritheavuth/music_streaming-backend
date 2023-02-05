const router = require("express").Router();

const song = require("../models/song");

router.get("/", async (req, res) => {
  const options = {
    sort: {
      createdAt: 1,
    },
  };

  const data = await song.find(options);

  if (data) {
    return res.status(200).send(data);
  } else {
    return res.status(400).send({ success: false, msg: "No Songs found" });
  }
});

router.get("/:id", async (req, res) => {
  const filter = { _id: req.params.id };

  const data = await artist.findOne(filter);

  if (data) {
    return res.status(200).send({ success: true, artist: data });
  } else {
    return res.status(400).send({ success: false, msg: "Artist not found" });
  }
});

router.post("/", async (req, res) => {
  const newSong = song({
    name: req.body.name,
    imageURL: req.body.imageURL,
    songURL: req.body.songURL,
    album: req.body.album,
    artist: req.body.artist,
    language: req.body.language,
    category: req.body.category,
  });

  try {
    const savedSong = await newSong.save();
    return res.status(200).send({ success: true, song: savedSong });
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
    const result = await album.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        songURL: req.body.songURL,
        album: req.body.album,
        artist: req.body.artist,
        language: req.body.language,
        category: req.body.category,
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

  result = await song.deleteOne(filter);
  if (result) {
    return res.status(200).send({ success: true, msg: "Song deleted" });
  } else {
    return res.status(400).send({ success: false, msg: "Song not found" });
  }
});

module.exports = router;