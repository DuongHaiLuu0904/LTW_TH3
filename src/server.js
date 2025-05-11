const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./BackEnd/db/dbConnect");
const UserRouter = require("./BackEnd/routes/UserRouter");
const PhotoRouter = require("./BackEnd/routes/PhotoRouter");
const photosOfUserRouter = require("./BackEnd/routes/photosOfUserRouter");
const StatsRouter = require("./BackEnd/routes/StatsRouter");

dbConnect();

app.use(cors());
app.use(express.json());

// Serve static files from the public/images directory
app.use('/images', express.static('public/images'));

app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/api/photosOfUser", photosOfUserRouter);
app.use("/api/stats", StatsRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});

