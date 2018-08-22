var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware");
var moment      = require("moment");

// INDEX
router.get("/", function(req, res){
  var noMatch;
  if(req.query.search){
    const regex = new RegExp(escapeRegExp(req.query.search), "gi");
    Campground.find({name: regex},function(err, foundCampgrounds){
      if(err){
        console.log(err);
      } else {
        if(foundCampgrounds.length < 1) {
          noMatch = "Sorry, no campground corresponds to your search. Please, search again";
        } 
        res.render("campgrounds/index", {campgrounds: foundCampgrounds, noMatch: noMatch});
      }
    });
  } else {
    Campground.find({},function(err, campgrounds){
      if(err){
        console.log(err);
      } else {
        res.render("campgrounds/index", {campgrounds: campgrounds, noMatch: noMatch});
      }
    });
  }
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
  // Add new name, price, image and description from form
  req.body.campground.description = req.sanitize(req.body.campground.description);
  var newCampground = req.body.campground; 
  // Add user info
  newCampground.author = {
    id: req.user._id,
    username: req.user.username
  }
  Campground.create(newCampground, function(err, campground){
    if(err){
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Successfully added campground");
      res.redirect("/campgrounds");
    }
  })
});

// SHOW
router.get("/:id",function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
    if(err || !campground){
      req.flash("error", "Campground not found");
      res.redirect("back");
    } else {
      res.render("campgrounds/show",{campground: campground, moment: moment});
    }
  });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err || !campground){
      req.flash("error", "Campground not found");
      res.redirect("back");
    } else {
      res.render("campgrounds/edit", {campground: campground});
    }
  });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  req.body.campground.description = req.sanitize(req.body.campground.description);
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
    if(err || !campground){
      req.flash("error", "Campground not found");
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + campground._id);
    }
  })
});

// DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndDelete(req.params.id, function(err){
    if(err){
      req.flash("error", err.message);
      res.redirect("back");
    }
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = router;