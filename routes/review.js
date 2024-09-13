const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema } = require("../Schema.js");
const {isLoggedIn,isreviewOwner}=require("../middleware.js");
const reviewController=require('../controllers/review.js');

const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else {
        next();
    }
}

//Now defining routes for reviews
//Create a new Review route
router.post("/reviews",isLoggedIn,validatereview,wrapAsync(reviewController.createReview));

//Delete a review route
router.delete("/reviews/:reviewId",isLoggedIn,isreviewOwner,wrapAsync(reviewController.deleteReview));

module.exports=router;
