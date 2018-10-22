var express                     = require('express')
var app                         = express()
var mongoose                    = require('mongoose');
var bodyParser                  = require('body-parser')
var flash                       = require("connect-flash")
var Comment                     = require("./models/comment")
var Campground                  = require("./models/campground")
var seedDB                      = require("./seeds")
var LocalStrategy               = require("passport-local")
var passport                    = require("passport")
var User                        = require("./models/user")
var methodOverride              = require("method-override")

// requiring routes
var commentRoutes               = require("./routes/comments")
var campgroundRoutes            = require("./routes/campgrounds")
var indexRoutes                 = require("./routes/index")
//seed the database
// seedDB()

mongoose.connect('mongodb://localhost:27017/yelp_camp',{ useNewUrlParser: true });
app.use (bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname +"/public"))
app.use(methodOverride("_method"))
app.use(flash());

// Passport config

app.use(require("express-session")({
    secret: "LOL",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


// Campground.create(
//      {
//          name: "Port credit", 
//          image: "https://www.parksbloggerontario.com/wp-content/uploads/2016/03/My-favorite-campsite-Cascade-Falls-Lake-Superior-Pukaskwa-National-Park-8.jpg",
//          description:"Top rated campground"
//      },
//      function(err, campground){
//       if(err){
//           console.log(err);
//       } else {
//           console.log("NEWLY CREATED CAMPGROUND: ");
//           console.log(campground);
//       }
//     });





//  var campgrounds = [ 
//         {name: "Kawthra Lakes", image: "https://www.northernontario.travel/sites/default/files/styles/cover_proportional/public/dac8d5e839328b413349aaa1385858c8_XL.jpg?itok=qjYzMhoC"},
//         {name: "Port credit", image: "https://www.parksbloggerontario.com/wp-content/uploads/2016/03/My-favorite-campsite-Cascade-Falls-Lake-Superior-Pukaskwa-National-Park-8.jpg"},
//         {name: "CreditRiver Creek", image: "https://o.aolcdn.com/images/dims3/GLOB/legacy_thumbnail/630x315/format/jpg/quality/85/http%3A%2F%2Fi.huffpost.com%2Fgen%2F4384992%2Fimages%2Fn-ONTARIO-CAMPING-628x314.jpg"},
//         {name: "Kawthra Lakes", image: "https://www.northernontario.travel/sites/default/files/styles/cover_proportional/public/dac8d5e839328b413349aaa1385858c8_XL.jpg?itok=qjYzMhoC"},
//         {name: "Port credit", image: "https://www.parksbloggerontario.com/wp-content/uploads/2016/03/My-favorite-campsite-Cascade-Falls-Lake-Superior-Pukaskwa-National-Park-8.jpg"},
//         {name: "CreditRiver Creek", image: "https://o.aolcdn.com/images/dims3/GLOB/legacy_thumbnail/630x315/format/jpg/quality/85/http%3A%2F%2Fi.huffpost.com%2Fgen%2F4384992%2Fimages%2Fn-ONTARIO-CAMPING-628x314.jpg"},
//         {name: "Kawthra Lakes", image: "https://www.northernontario.travel/sites/default/files/styles/cover_proportional/public/dac8d5e839328b413349aaa1385858c8_XL.jpg?itok=qjYzMhoC"},
//         {name: "Port credit", image: "https://www.parksbloggerontario.com/wp-content/uploads/2016/03/My-favorite-campsite-Cascade-Falls-Lake-Superior-Pukaskwa-National-Park-8.jpg"},
//         {name: "CreditRiver Creek", image: "https://o.aolcdn.com/images/dims3/GLOB/legacy_thumbnail/630x315/format/jpg/quality/85/http%3A%2F%2Fi.huffpost.com%2Fgen%2F4384992%2Fimages%2Fn-ONTARIO-CAMPING-628x314.jpg"}
        
//         ]

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

    
app.listen(process.env.PORT,process.env.IP, function(){
    console.log('Yelpcamp server has started')
});