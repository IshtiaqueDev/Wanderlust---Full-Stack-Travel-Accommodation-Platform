const Listing = require("./models/Listing");
const {listingSchema}=require("./Schema.js");
const {reviewSchema}=require("./Schema.js")
const ExpressError=require("./utils/ExpressError.js");
const Review=require("./models/review.js");


    //Checks User is loggedIn or not
module.exports.isLoggedIn=(req,res,next)=>{ 
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to access!");
        return res.redirect("/login");
    }
    next();
};

    //Redireted URl save Middleware
    module.exports.saveRedirectedUrl=(req,res,next)=>{
        if(req.session.redirectUrl){
         res.locals.redirectedUrl=req.session.redirectUrl;
        }
        next();
    }

    //Authorization for User Checks its owner or not
    module.exports.isOwner=async(req,res,next)=>{
        let {id}=req.params;
        console.log(id);
        let listing=await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.user._id)){
            req.flash("error","Request Denied You dont have permission to do this");
           return res.redirect(`/listings/${id}`);
        }
        next();
    }


    //Authorization for User Checks its owner or not
    module.exports.isReviewAuthor=async(req,res,next)=>{
        let {id,reviewId}=req.params;
        let review=await Review.findById(reviewId);
        if(!review.author._id.equals(res.locals.user._id)){
            req.flash("error","Request Denied You are not the author of this Review");
           return res.redirect(`/listings/${id}`);
        }
        next();
    }

    //Validate listing 
    module.exports.validateListing=(req,res,next)=>{
        let {error}=listingSchema.validate(req.body);
        console.log(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
    }

    //Validate Reviews
    module.exports.validateReview=(req,res,next)=>{
        let {error}=reviewSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
    }