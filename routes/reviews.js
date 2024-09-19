const express = require('express')
const router = express.Router({mergeParams:true})
const review = require('../controllers/reviews')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const Campground = require('../models/campground');
const Review = require('../models/review');

const {reviewSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');


router.post('/',isLoggedIn,validateReview,catchAsync(review.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(review.deleteReview));

module.exports = router;