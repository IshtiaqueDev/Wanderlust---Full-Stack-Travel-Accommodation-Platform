const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../Schema.js")
const Listing=require("../models/Listing")
const Review=require("../models/review.js");
const { isLoggedIn,validateReview, isReviewAuthor } = require("../middleware.js");
const router=express.Router({mergeParams:true});  




//Adding Reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    const newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    let result=await newReview.save();
    let id=req.params.id;
    let listing=await Listing.findById(id);
    listing.reviews.push(result._id);
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${id}`);
}));



//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

    module.exports=router;