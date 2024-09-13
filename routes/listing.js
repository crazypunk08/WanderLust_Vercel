const express = require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema, } = require("../Schema.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require('../controllers/listings.js');
const multer  = require('multer')
const {storage}=require('../cloudConfig.js');
const upload = multer({ storage });

//Now bringing all the listing paths in the same file
const validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else {
        next();
    }
};

//Route for search request
router.get("/search/list",wrapAsync(listingController.search)
);

//To create a new post NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewform);

//To search for all the applications SEARCH ROUTE
router.get("/", wrapAsync(listingController.showListings));


//Create Route
router.post("/",isLoggedIn,upload.single('listing[image]'),validateListing,  wrapAsync(listingController.createListings));


router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//To render the edit template
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.editListings));

//To find an  listing by its id and update it
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'), wrapAsync(listingController.updateListings));


//To delete a particular listing
router.delete("/:id",isLoggedIn, isOwner,wrapAsync(listingController.deleteListings));

//This route is to check an individual listing
router.get("/:id", wrapAsync(listingController.index));

module.exports=router;