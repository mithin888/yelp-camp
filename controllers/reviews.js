// Custom modules for schemas via mongoose
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.create = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully added review!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.delete = async (req, res) => {
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
};