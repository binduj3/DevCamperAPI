const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");

//bindutest9@gmail.com for mongodb
//https://www.udemy.com/course/nodejs-api-masterclass/learn/lecture/16582026#overview

//Load env variables
dotenv.config({ path: "./config/config.env" });

//Connect to Db
connectDB();

//Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

const app = express();

//Body parser
app.use(express.json());

//cookie parser
app.use(cookieParser);

//Created a custom middleware
//app.use(logger);

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const PORT = process.env.PORT || 5000;

//File Upload
app.use(fileUpload());

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));
//open a browser type http://localhost:5000/uploads/photo_602842e2e69b2db86c90f535.jpg

//Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

//error handling middleware
app.use(errorHandler);

// app.get("/", (req, res) => {
//   // res.send("Hello from express");
//   res.status(400).send({ success: false });
// });

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`
      .yellow.bold
  )
);

//Handle unhandle promise rejections
process.on("unhandleRejection", (err, promise) => {
  console.log(`Error:${err.message}`.red);
  //close server & exit process
  server.close(() => process.exit(1));
});
