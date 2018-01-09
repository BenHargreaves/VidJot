const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/database');

// Map Global Promise - get rid of Mongo warning 
mongoose.Promise = global.Promise;
// Connect to Mongoose
mongoose.connect(db.mongoURI,{
    useMongoClient: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override middleware - used to enable HTML form PUT and DELETE requests
app.use(methodOverride('_method'));

// Expression sessions middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// PassportJS middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash middleware
app.use(flash());

// Global Variables
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// Index Route
app.get('/', (req, res) => {
    res.render('index');
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

// For Heroku Deployment
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started in port ${port}`)
});