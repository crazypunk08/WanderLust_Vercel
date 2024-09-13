if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
//------use of ejs mate for a better templating experience
const engine = require('ejs-mate');
app.engine('ejs', engine);
// --------------------------------------------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; //THIS IS FOR CONNECTION WITH MONGODB DATABASE WITH THE LOCAL SYSTEM
// const dburl=process.env.ATLASDB; //CONNECTING WITH THE MONGODB CLOUD
const dburl=MONGO_URL; 
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(dburl);
}

// app.get("/", (req, res) => {
//     res.send("Hi I am root");
// });

//here we are using mongodb for session storage rather than default memory storage
const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter:24*3600,
  });

store.on("error",()=>{
    console.log("Error in mongo session store",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,//Age in milliseconds We are saving the data of user for 7 days
        httpOnly: true,//Session deals with only HTTPS request
    },
};



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

app.use("/listings", listing);

app.use("/listings/:id", review);
app.use("/", userRouter);




//Defining error handling middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
    // res.status(statusCode).send(message);
});



app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});




// app.get("/testListing",async (req,res)=>{
//     let sampleListing =new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Goa",
//         Country:"India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Sucessfull testing");

// })

