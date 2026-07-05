const express=require("express");
const app=express();
const port=3000;
const user=require("./routes/users");
const post=require("./routes/post");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");
const sessionOption={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.sucessMsg=req.flash("success");
    res.locals.failed=req.flash("failed");
    next();
})

app.get("/register",(req,res)=>{
    let {name="Anonymous"}=req.query;
    req.session.name=name;
   //c console.log(req.session);
   // res.send(name);
   if(name==="Anonymous"){
    req.flash("failed","User registration Failed");
   }else{
   req.flash("success","user registered succesully!");
    }
    res.redirect("/hello"); 
})

app.get("/hello",(req,res)=>{
   // res.send(`Hello.. , ${req.session.name}`);    
   let name=req.session.name;
   res.render("page",{name});
})

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`You sent a Request ${req.session.count} times`);
// })

// app.get("/test",(req,res) =>{
//     res.send("Test Successfull");
// })

app.listen(port,()=>{
    console.log("Server is Listening...");
})
