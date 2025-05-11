const express = require("express");
const router = express.Router();
const Photo = require("../db/photoModel");
const mongoose = require("mongoose");

// Get all users with their photo and comment counts
router.get("/user-stats", async (request, response) => {
  try {
    // Aggregate to get photo counts for each user
    const photoStats = await Photo.aggregate([
      { $group: { 
        _id: "$user_id", 
        photoCount: { $sum: 1 } 
      }}
    ]);
    
    // Aggregate to get comment counts for each user
    const commentStats = await Photo.aggregate([
      { $unwind: "$comments" },
      { $group: { 
        _id: "$comments.user_id", 
        commentCount: { $sum: 1 } 
      }}
    ]);
    
    // Create a map of user IDs to their statistics
    const statsMap = {};
    
    // Add photo stats to the map
    photoStats.forEach(stat => {
      const userId = stat._id.toString();
      if (!statsMap[userId]) {
        statsMap[userId] = { photoCount: 0, commentCount: 0 };
      }
      statsMap[userId].photoCount = stat.photoCount;
    });
    
    // Add comment stats to the map
    commentStats.forEach(stat => {
      const userId = stat._id.toString();
      if (!statsMap[userId]) {
        statsMap[userId] = { photoCount: 0, commentCount: 0 };
      }
      statsMap[userId].commentCount = stat.commentCount;
    });
    
    response.json(statsMap);
  } catch (error) {
    console.error("Error getting user statistics:", error);
    response.status(500).send({ message: "Internal server error" });
  }
});

// Get all comments by a specific user
router.get("/user-comments/:id", async (request, response) => {
  try {
    const userId = new mongoose.Types.ObjectId(request.params.id);
    
    // Find all photos that have comments from this user
    const results = await Photo.aggregate([
      { $match: { "comments.user_id": userId } },
      { $unwind: "$comments" },
      { $match: { "comments.user_id": userId } },
      { $project: {
          _id: 1,
          file_name: 1,
          user_id: 1,  // Include the photo owner's user ID
          comment: "$comments.comment",
          date_time: "$comments.date_time",
          comment_id: "$comments._id"
      }},
      { $sort: { date_time: -1 } } // Sort by comment date, newest first
    ]);
    
    response.json(results);
  } catch (error) {
    console.error("Error getting user comments:", error);
    response.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
