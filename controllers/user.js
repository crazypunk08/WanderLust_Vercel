const User=require("../models/user.js");
const passport=require('passport');

module.exports.showsignup=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.createsignup=async (req,res)=>{
    try{
        let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to wanderLust");
        res.redirect("/listings");
    });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    

};

module.exports.showlogin=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.createlogin=async (req,res)=>{
    req.flash("success","Welcome to Wanderlust!");
    //the below condition is writted to deal with empty value of redirectUrl
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
     if(err){
         return next(err);
     }
     req.flash("success","You logged out!");
     res.redirect("/listings");
    });
 };

