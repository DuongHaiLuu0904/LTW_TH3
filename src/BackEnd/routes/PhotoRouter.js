const express = require("express");
const router = express.Router();

const Photo = require("../db/photoModel");
const User = require("../db/userModel");

router.post("/", async (request, response) => {
  
});

router.get("/list", async (request, response) => {
    const list = await Photo.find({});
    response.json(list);
});


module.exports = router;

