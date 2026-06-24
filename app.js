const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/Listing")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./Schema.js")
const Review=require("./models/review.js");
const listings=require("./routes/listing.js")
const review=require("./routes/review.js")
const port=8080; 
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
main().then((res)=>{
    console.log("Connected with Database Successfully!");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}



app.use("/listings",listings);
app.use("/listings/:id/reviews",review);



app.get("/",(req,res)=>{
    res.send("Hi Iam Root!");
})


app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
});


app.use((err,req,res,next)=>{
    let {status=500,message="Something Went Wrong!"}=err;
    res.status(status).render("error.ejs",{err});
    // res.status(status).send(message);
})


app.listen(port,()=>{
    console.log("Server is listening to port 8080");
})
