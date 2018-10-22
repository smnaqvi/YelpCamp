var express                     = require('express');
var router                      = express.Router();
var Campground                  = require("../models/campground")
var Comment                     = require("../models/comment")
var middleware                  = require("../middleware/index.js")

//Index route

router.get("/",function (req, res) {
  Campground.find({},function(err, allcampgrounds){
      if(err){
          console.log(err);
      } else {
          res.render("campgrounds/index",{campgrounds:allcampgrounds});
      }
       
  });
})

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn,function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description= req.body.description;
    var author={
        id:req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name,price:price, image: image,description: description,author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//new campground
    
    router.get("/new", middleware.isLoggedIn,function(req, res) {
        res.render("campgrounds/new")
    })
    
 // show- shows more info about a campground
    router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
// router.get("/:id/edit", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//update campground route

router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
    // find and update campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
                // redirect show page
            res.redirect("/campgrounds/" +req.params.id);
        }
    })

})

//Destroy campground route

// router.delete("/:id", function(req,res){
    router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;