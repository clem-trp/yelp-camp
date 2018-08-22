var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      res.render("comments/new", {campground: campground});    
    }
  });
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err || !campground){
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    } else {
      var newComment = {
        text: req.sanitize(req.body.commentText),
        author: {
          id: req.user._id,
          username: req.user.username
        }
      };
      Comment.create(newComment, function(err, comment){
        if(err){
          req.flash("error", err.message);
          res.redirect("back");
        } else {
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added comment");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// EDIT
router.get("/:idComment/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.idComment, function(err, comment){
    if(err || !comment){
      req.flash("error", "Comment not found");
      res.redirect("back");
    } else {
      res.render("comments/edit", {comment: comment, campground_id: req.params.id});
    }
  });
});

// UPDATE
router.put("/:idComment", middleware.checkCommentOwnership, function(req, res){
  req.body.comment.text = req.sanitize(req.body.comment.text);
  Comment.findByIdAndUpdate(req.params.idComment, req.body.comment, function(err, comment){
    if(err || !comment){
      req.flash("error", "Comment not found");
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DELETE
router.delete("/:idComment", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndDelete(req.params.idComment, function(err){
    if(err){
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Successfully deleted comment");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;