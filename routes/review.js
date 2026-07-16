const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../Schema.js")
const Listing=require("../models/Listing")
const Review=require("../models/review.js");
const { isLoggedIn,validateReview, isReviewAuthor } = require("../middleware.js");
const router=express.Router({mergeParams:true});  
const reviewController=require("../controllers/review.js");



//Adding Reviews
router.post("/",isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));


//Delete Review Route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));

    module.exports=router;