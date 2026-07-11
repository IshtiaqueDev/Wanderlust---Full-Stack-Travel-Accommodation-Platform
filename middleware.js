module.exports.isLoggedIn=(req,res,next)=>{ 
    
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to access!");
        return res.redirect("/login");
    }
    next();
};


    module.exports.saveRedirectedUrl=(req,res,next)=>{
        if(req.session.redirectUrl){
            res.locals.redirectedUrl=req.session.redirectUrl;
        }
        next();
    }