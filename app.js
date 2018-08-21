var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport 							= require("passport"),
    LocalStrategy 				= require("passport-local"),
    methodOverride        = require("method-override"),
    flash                 = require("connect-flash"),
    
    Campground            = require("./models/campground"),
    User 									= require("./models/user"),
    Comment               = require("./models/comment"),
    seedDB                = require("./seed");
  
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes        = require("./routes/index");
    
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());
// Passport configuration
app.use(require("express-session")({
	secret: "My name is Clement Turpain and I like west coast swing",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));

seedDB();

// Add elements available in every template
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("YelpCamp server has started");
});

