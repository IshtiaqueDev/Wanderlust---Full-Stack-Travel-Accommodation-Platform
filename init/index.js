const mongoose=require("mongoose");
const AllData=require("../init/data");
const Listing=require("../models/Listing");

main().then(()=>{
    console.log("Connnection Formed Successfully!");
}).catch((err)=>{
    console.log(err);
})


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


const initDB=async()=>{
    await Listing.deleteMany({});
   await  Listing.insertMany(AllData.data);
}

initDB();
