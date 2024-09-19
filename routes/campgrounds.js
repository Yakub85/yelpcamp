const express = require('express')
const router = express.Router()
const campground = require('../controllers/campgrounds.js')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

const multer  = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
// const upload = multer({ dest: 'uploads/' }) //used for local folder

const Campground =  require('../models/campground')

// upload.array('image')


router.route('/')
    .get(catchAsync(campground.index))  
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campground.createCampground))
    // .post(upload.array('image'), (req, res)=>{
    //     // res.send(req.body)
    //     console.log(req.body ,req.files)
    //     res.send("Its worked")
    
    // })
    
    
router.get('/new',isLoggedIn, campground.renderNewForm);

router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor,upload.array('image') ,validateCampground,catchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

     
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.renderEditForm))

module.exports = router;