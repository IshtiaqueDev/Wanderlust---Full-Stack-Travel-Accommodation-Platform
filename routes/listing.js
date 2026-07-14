const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../Schema.js")
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/Listing")
const listings=require("../routes/listing.js")
const {isLoggedIn, saveRedirectedUrl,isOwner,validateListing}=require("../middleware.js");
const router=express.Router();



// Index Route 
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}))

//Show Route
    router.get("/:id",wrapAsync(async(req,res)=>{
        let id=req.params.id;
        let listing=await Listing.findById(id).populate(
            {path:"reviews",
            populate:{path:"author"}}).populate("owner");
        if(!listing){
            req.flash("error","Listing You Requested for does not exist!");
            res.redirect("/listings");
        }else{
        //console.log(list);   
        // res.send(list) 
       // console.log(listing);
        res.render("./listings/show.ejs",{listing});
    }   
    }))

router.get("/new/add",isLoggedIn,(req,res)=>{
    // console.log(req.user);
    // if(!req.isAuthenticated()){
    // req.flash("error","You must be logged in to Create a Listing!");
    //  res.redirect("/login"); 
    // }else{
        res.render("./listings/form.ejs");
    //}
})

//CREATE Route
router.post("/",validateListing,isLoggedIn,wrapAsync(async(req,res,next)=>{
     const newListing=new Listing(req.body.listing);
     newListing.owner=req.user._id;
     console.log(req.user._id);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));


//Update Route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    let id=req.params.id;
   let list= await Listing.find({_id:id});
   if(!list || list.length==0){
    req.flash("error","Listing Does not Exist!");
    res.redirect("/listings");
   }else{
    res.render("./listings/edit.ejs",{list});
}}))

//Edited Data (Updation)
router.put("/:id/edits",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // let listing=await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.user._id)){
    //     req.flash("error","You don't have permission to edit");
    //     res.redirect(`/listings/${id}`);
    // }else{
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
   req.flash("success","Listing Updated Sucessfully!");
    res.redirect(`/listings/${id}`);
}))




//Delete Route
router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    console.log("Reached here");
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings")
}));


    module.exports=router;