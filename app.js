const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyparser = require('body-parser')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')

const errorMiddleware = require("./middleware/error");

app.use(cors({ origin: ["http://localhost:3000"],credentials:true }));
app.use(bodyparser.json({ limit: "150mb"}));
app.use(bodyparser.urlencoded({ limit: "150mb", extended:true}))
app.use(express.json());
app.use(cookieParser()); 
app.use(fileUpload({
    useTempFiles:true
}))


//setting  up cloudinary configuration
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const property = require("./route/propertyRoute");
const User = require("./route/userRoute");
app.use(property);


app.use(User);
app.use(errorMiddleware);   


module.exports = app;
