const express = require("express");
const router = express.Router();

const User = require("../db/userModel");
const Photo = require("../db/photoModel");

router.get("/:id", async (request, response) => {
    try {
        const user = await User.findById(request.params.id);
        if (user) {
            const photos = await Photo.find({ user_id: request.params.id });            const processedPhotos = [];

            for (let i = 0; i < photos.length; i++) {
                const photoObj = photos[i].toObject();
                const processedComments = [];
                
                for (let j = 0; j < photoObj.comments.length; j++) {
                    const comment = photoObj.comments[j];
                    const commentUser = await User.findById(comment.user_id);
                    processedComments.push({
                        ...comment,
                        user: commentUser ? commentUser.toObject() : null
                    });
                }
                
                processedPhotos.push({
                    ...photoObj,
                    comments: processedComments
                });
            }
            response.json(processedPhotos);
        } else {
            response.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error in photosOfUser route:", error);
        response.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;

