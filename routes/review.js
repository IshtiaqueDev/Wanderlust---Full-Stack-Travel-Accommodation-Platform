const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../Schema.js")
const Listing=require("../models/Listing")
const Review=require("../models/review.js");
const router=express.Router();  


const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//Adding Reviews
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    const newReview=new Review(req.body.review);
    let result=await newReview.save();
    let id=req.params.id;
    let listing=await Listing.findById(id);
    listing.reviews.push(result._id);
    await listing.save();
    res.redirect(`/listings/${id}`);
}));



//Delete Review Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

    module.exports=router;