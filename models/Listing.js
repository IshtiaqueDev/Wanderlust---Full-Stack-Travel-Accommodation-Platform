const mongoose=require("mongoose");
const Review=require("./review.js");
main().then((res)=>{
    console.log("Connected with Database Successfully!");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}
const DEFAULT_IMAGE = "https://plus.unsplash.com/premium_photo-1682377521697-bc598b52b08a?q=80&w=915";
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxLength:100
    },description:{
        type:String,
        },image:{
            filename:String,
            url:{
                type:String,
                default:DEFAULT_IMAGE,
                set: (v) => (!v || v === "") ? DEFAULT_IMAGE : v
            },
     },price:Number,
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }]
})


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
}});

const Listing=mongoose.model("Listing",listingSchema);
    module.exports=Listing;