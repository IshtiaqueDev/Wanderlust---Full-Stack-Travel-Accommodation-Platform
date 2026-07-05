const express=require("express");
const router=express.Router();


//Post
//Index Route 
router.get("/",(req,res)=>{
    res.send("GET for Posts"); 
})


//Show  
router.get("/:id",(req,res)=>{
    res.send("GET for show Posts!");
})

//POST 
router.post("/",(req,res)=>{
    res.send("POST for Posts");
})

//Delete  
router.delete("/:id",(req,res)=>{
    res.send("Delete for Posts");
})

module.exports = router;