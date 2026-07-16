const Review=require("../models/review.js");
const Listing=require("../models/Listing.js");

//Create Review
module.exports.createReview=async(req,res)=>{
    const newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    let result=await newReview.save();
    let id=req.params.id;
    let listing=await Listing.findById(id);
    listing.reviews.push(result._id);
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${id}`);
}

//Delete Review
module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}