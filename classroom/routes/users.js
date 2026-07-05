const express=require("express");
const router=express.Router();



//Index Route 
router.get("/",(req,res)=>{
    res.send("GET for Users"); 
})


//Show - Route
router.get("/:id",(req,res)=>{
    res.send("GET for show users!");
})

//POST - Users 
router.post("/",(req,res)=>{
    res.send("POST for users");
})

//Delete Users 
router.delete("/:id",(req,res)=>{
    res.send("Delete for Users");
})


    module.exports = router;