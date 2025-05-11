const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./BackEnd/db/dbConnect");
const UserRouter = require("./BackEnd/routes/UserRouter");
const PhotoRouter = require("./BackEnd/routes/PhotoRouter");
const photosOfUserRouter = require("./BackEnd/routes/photosOfUserRouter");

dbConnect();

app.use(cors());
app.use(express.json());

app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/api/photosOfUser", photosOfUserRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});

