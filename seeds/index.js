const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error"))
db.once("open",()=>{
    console.log("Database connection established");
})

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()  * 20) +10;
        const camp = new Campground({
            author:'66e6e130e6d4818102316081',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'lorem ipsum  dolor sit amet, consectetur adipiscing elit sed     diam  nonumy eirmod tempor invid.',
            price:price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images:[
                {
                    url: 'https://res.cloudinary.com/dto5a0qn0/image/upload/v1726480065/YelpCamp/pv69ly97esqm95ymftur.jpg',
                    filename: 'YelpCamp/pv69ly97esqm95ymftur',
    
                  },
                  {
                    url: 'https://res.cloudinary.com/dto5a0qn0/image/upload/v1726480063/YelpCamp/g3tzjjaht54zycuk6phw.jpg',
                    filename: 'YelpCamp/g3tzjjaht54zycuk6phw',
                  }
            ]
         })
        await camp.save();
   }
}

seedDB().then(() => {
    mongoose.connection.close();
})