const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const Buyer = require("./router/Buyer");
const Seller = require("./router/Seller");
const db = require("./config/mongoose-connections");
const expressSession = require("express-session");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.use(
    expressSession({
        secret: "93847n48vnvt93w67t97",  // Change this to a strong secret
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }  // 1 day
    })
);

app.use("/", Buyer)
app.use("/creator/sachin", Seller)



app.listen(3000)
