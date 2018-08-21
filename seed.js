var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");
var User        = require("./models/user")
 
var data = [
    {
        name: "Cloud's Rest", 
        price: "10.00",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        price: "50.00",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        price: "1.00",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]


 
function seedDB(){
   //Remove all campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    } else {
      console.log("removed campgrounds!");
      Comment.remove({}, function(err) {
        if(err){
          console.log(err);
        } else {
          console.log("removed comments!");
          // add a few campgrounds
          User.findOne({username: "Clement"}, function(err, defaultUser){
            if(err) {
              console.log(err);
            } else {
              data.forEach(function(seed){
                seed.author = {
                  id: defaultUser._id,
                  username: defaultUser.username
                }
                Campground.create(seed, function(err, campground){
                  if(err){
                    console.log(err)
                  } else {
                    console.log("added a campground");
                    // create a comment
                    var basicComment = {
                      text: "This place is great, but I wish there was internet",
                      author: {
                        id: defaultUser._id,
                        username: defaultUser.username
                      }
                    };
                    Comment.create(basicComment, function(err, comment){
                      if(err){
                        console.log(err);
                      } else {
                        campground.comments.push(comment);
                        campground.save();
                        console.log("Created new comment");
                      }
                    });
                  }
                });
              });
            }
          });
        }
      });
    }
  });
}
 
module.exports = seedDB;