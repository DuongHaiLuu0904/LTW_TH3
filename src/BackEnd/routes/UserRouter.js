const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.get("/list", async (request, response) => {
    const list = await User.find({}).select({ "_id": 1, "first_name": 1, "last_name": 1 });
    response.json(list)
});

router.get("/:id", async (request, response) => {
    const user  = await User.findById(request.params.id);
    if (user) {
        response.json(user);
    } else {
        response.status(404).send({ message: "User not found" });
    }
});

module.exports = router;

