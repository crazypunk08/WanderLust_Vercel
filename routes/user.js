const express = require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl}=require('../middleware.js');
const userController=require('../controllers/user.js');
const passport=require('passport');

//First creating a route and page for signup
router.get('/signup',userController.showsignup);

router.post('/signup',wrapAsync(userController.createsignup));

//Creating a page for Login and its respective route handlers
router.get('/login',userController.showlogin);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),userController.createlogin);

//logout route
router.get('/logout',userController.logout);


module.exports=router;