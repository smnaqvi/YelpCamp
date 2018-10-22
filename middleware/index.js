var Campground                  = require("../models/campground")
var Comment                     = require("../models/comment")
// all the middleware goes here
var middlewareObj={};

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership (req,res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               req.flash("error","campground not found")
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                 req.flash("error","You do not have permission to do that")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
    }


middlewareObj.checkCommentOwnership =function checkCommentOwnership (req,res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
    }


middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first");
    console.log("error")
    res.redirect("/login");
}



module.exports = middlewareObj