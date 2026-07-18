const Listing=require("../models/Listing");

//Index
module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};


// Show
module.exports.showListing=async(req,res)=>{
        let id=req.params.id;
        let listing=await Listing.findById(id).populate(
            {path:"reviews",
            populate:{path:"author"}}).populate("owner");
        if(!listing){
            req.flash("error","Listing You Requested for does not exist!");
            res.redirect("/listings");
        }else{
        res.render("./listings/show.ejs",{listing});
    }   
    };


//Create 
module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
     const newListing=new Listing(req.body.listing);
     newListing.owner=req.user._id;
     newListing.image={url,filename};
     await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};


//Update Route
module.exports.updateListing=async(req,res)=>{
    let id=req.params.id;
   let list= await Listing.find({_id:id});
//    console.log(list);
   if(!list || list.length==0){
    req.flash("error","Listing Does not Exist!");
    res.redirect("/listings");
   }else{
    let origionalUrl=list[0].image.url;
    origionalUrl=origionalUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs",{list,origionalUrl});
}};

//Edited Data
module.exports.editedData=async(req,res)=>{
    let {id}=req.params;
   let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(req.file){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
   req.flash("success","Listing Updated Sucessfully!");
    res.redirect(`/listings/${id}`);
}


//Form Rendering
module.exports.formRendering=(req,res)=>{
        res.render("./listings/form.ejs");
};

//Delete Route
module.exports.destroyListing=async(req,res)=>{
    console.log("Reached here");
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings")
}