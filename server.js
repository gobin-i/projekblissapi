// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose    = require('mongoose');
var jwt        = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config     = require('./config');
var UserVoted       = require('./app/models/UserVoted');
var Users       = require('./app/models/Users');

var port = process.env.PORT || 8080;        // set our port
mongoose.connect(config.database);
app.set('superSecret', config.secret);
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//log
app.use(morgan('dev'));

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
// ----------------------------------------------------
router.route('/UserVoted')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        
        var uservoted = new UserVoted();      // create a new instance of the Bear model
        uservoted.fbtoken = req.body.fbtoken;  // set the bears name (comes from the request)

        // save the bear and check for errors
        uservoted.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'uservoted created!' });
        });
        
    })
    // get all the bears (accessed at GET http://localhost:8080/api/uservoted)
    .get(function(req, res) {
        UserVoted.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

router.route('/Users')
    
    .post(function(req, res) {
        
        var users = new Users();      // create a new instance of the Bear model
        users.name = req.body.name;  // set the bears name (comes from the request)
        users.ic = req.body.ic;
        users.name = req.body.name;

        // save the bear and check for errors
        uservoted.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'uservoted created!' });
        });
        
    })


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);