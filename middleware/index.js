var Comment     = require("../models/comment"),
    Campground  = require("../models/campground");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please log in before proceeding");
  res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.idComment, function(err, comment){
      if(err || !comment) {
        console.log(err);
        req.flash("error", "Sorry, comment couldn't be found !");
        res.redirect("back");
      } else {
        if(comment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You cannot edit or delete a comment you did not post");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please log in before proceeding");
    res.redirect("back");
  }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, campground){
      if(err || !campground) {
        console.log(err);
        req.flash("error", "Sorry, campground couldn't be found !");
        res.redirect("back");
      } else {
        if(campground.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You cannot edit or delete a campground you did not create");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please log in before proceeding");
    res.redirect("back");
  }
}

module.exports = middlewareObj;