const User=require("../models/user.js");

module.exports.signupRoute=async(req,res)=>{
    try{
    let user=req.body;
    //console.log(user);
    const newUser=new User(user);;
    const registeredUser=await User.register(newUser,user.password);
    //console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","Welcome to Wanderlust!");
        return res.redirect("/listings");
    });   
    }catch(err){
        req.flash("error",err.message);
        return res.redirect("/signup");
    }
}


module.exports.loginGet=(req,res)=>{
    res.render("./users/login.ejs");
}


module.exports.loginPost=async(req,res)=>{
    req.flash("success","Welcome to Wanderlust !");
    if(res.locals.redirectedUrl){
    res.redirect(res.locals.redirectedUrl);
    }else{
    res.redirect("/listings");  
}}


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout Successfully!");
        res.redirect("/listings");
    });
}