const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const Buyer = require("./router/Buyer");
const Seller = require("./router/Seller");
const db = require("./config/mongoose-connections");
const expressSession = require("express-session");
require("dotenv");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET, // Keep it safe
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // Use your MongoDB URI
        collectionName: "sessions",
        ttl: 14 * 24 * 60 * 60 // Sessions last for 14 days
    })
}));

app.use("/", Buyer)
app.use("/creator/sachin", Seller)



app.listen(process.env.PORT);
