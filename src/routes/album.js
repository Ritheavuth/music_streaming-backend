const router = require("express").Router();

const album = require("../models/album");

router.get("/", async (req, res) => {
    const options = {
        sort: {
          createdAt: 1,
        },
      };
    
      const data = await album.find(options);
    
      if (data) {
        return res.status(200).send({data: data});
      } else {
        return res.status(400).send({ success: false, msg: "No Albums found" });
      }
});

router.post("/", async (req, res) => {
  const newAlbum = album({
    name: req.body.name,
    imageURL: req.body.imageURL,
  });

  try {
    const savedAlbum = await newAlbum.save();
    return res.status(200).send({ success: true, album: savedAlbum });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error });
  }
});

router.get("/:id", async (req, res) => {
  const filter = { _id: req.params.id };

  const data = await album.findOne(filter);

  if (data) {
    return res.status(200).send({ success: true, album: data });
  } else {
    return res.status(400).send({ success: false, msg: "Album not found" });
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

    result = await album.deleteOne(filter);
    if (result) {
      return res.status(200).send({ success: true, msg: "Album deleted" });
    } else {
      return res.status(400).send({ success: false, msg: "Album not found" });
    }
});

module.exports = router;
