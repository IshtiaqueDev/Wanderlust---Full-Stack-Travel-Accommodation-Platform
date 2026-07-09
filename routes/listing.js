const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../Schema.js")
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/Listing")
const listings=require("../routes/listing.js")
const {isLoggedIn}=require("../middleware.js");
const router=express.Router();


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


// Index Route 
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}))

//Show Route
    router.get("/:id/",wrapAsync(async(req,res)=>{
        let id=req.params.id;
        let listing=await Listing.findById(id).populate("reviews");
        if(!listing){
            req.flash("error","Listing You Requested for does not exist!");
            res.redirect("/listings");
        }else{
        //console.log(list);   
        // res.send(list) 
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
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));


//Update Route
router.get("/:id/edit",isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
    let id=req.params.id;
   let list= await Listing.find({_id:id});
   if(!list || list.length==0){
    req.flash("error","Listing Does not Exist!");
    res.redirect("/listings");
   }else{
    res.render("./listings/edit.ejs",{list});
}}))

//Edited Data (Updation)
router.put("/:id/edits",wrapAsync(async(req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
   req.flash("success","Listing Updated Sucessfully!");
    res.redirect("/listings");
}))




//Delete Route
router.delete("/:id/delete",isLoggedIn,wrapAsync(async(req,res)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings")
}));


    module.exports=router;