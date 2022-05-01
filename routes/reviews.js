// Initializing Express and Express Router
const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams needs to be true to access campgrounds/:id route defined in app.js

// Custom modules for schemas via mongoose
const Campground = require('../models/campground');
const Review = require('../models/review');

// Error handling custom modules from utils
const catchAsync = require("../utils/catchAsync");

// Importing middleware functions
const { validateReview } = require("../middleware");


router.post("/", validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Successfully added review!");
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:reviewId", catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id,
    {
      $pull: {
        reviews: reviewId
      }
    });
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;