if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
// require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash');
const Joi = require('joi');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local')
const User = require('./models/user')
const helmet = require('helmet')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const dbUrl=process.env.DB_URL
const port = process.env.PORT || 3000
// const dbUrl='mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error"))
db.once("open",()=>{
    console.log("Database connection established");

});

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
const sessionConfig = {
    store,
    name: 'session',
    secret,
    name:'session',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure:true,
        expires:Date.now()+1000 * 60 *60 * 24 * 7,
        maxAge: 1000 * 60 *60 * 24 * 7,
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet());
const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js",
    "https://cdn.jsdelivr.net/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dto5a0qn0/", 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);




app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.get('/fakeUser',async(req,res) =>{
    const user = new User({email:'yakub@gmail.com',username:'yakub'});
    const newUser = await User.register(user,'chicken');
    res.send(newUser);
})


app.use('/',userRoutes);
app.use('/campgrounds/',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/', (req, res) => {
    res.render('home');    
});




app.all('*',(req,res,next) =>{
    next(new ExpressError('Page Not Found', 404))
});


app.use((err,req,res,next)=>{
    const  {statusCode=500} =err;
    if(!err.message) err.message='Something went wrong!'
    res.status(statusCode).render('error',{err})
})
app.listen(port,()=>{
    console.log(`Server started on port${port}`);
});










