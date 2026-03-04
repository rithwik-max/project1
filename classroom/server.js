const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path= require("path");


app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const sessionOpetions = {
     secret: "mysupersecrerstring",
     resave:false,
     saveUninitialized:true,
    };
app.use(session(sessionOpetions));
app.use(flash());

app.get("/register",(req,res)=>{
    let { name } = req.query;
    req.session.name = name;
    req.flash("success","user registred successfully!!");
    res.redirect("/hello");
});
app.get("/hello",(req,res) => {
    res.render("page.ejs",{name:req.session.name , msg:req.flash("success")});
});
app.get("/test",(req,res) => {
    res.send("test successfull");
});

app.listen(3000,() => {
    console.log("server started");
});