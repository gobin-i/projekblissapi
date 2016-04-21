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
var UserVoted       = require('./app/models/userVoted');
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
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

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

// authenticate and if fbid dont exist, insert into uservoted and passback token
router.route('/authenticate')
.post(function(req, res) {
    UserVoted.findOne({fbid: req.body.fbid}, function(err, user) {

        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
               res.json({
                    type: false,
                    data: "You already voted"
                    //type: true,
                    //data: user,
                    //token: user.token
                }); 
            } else {
                //dont exist so we put inside uservoted data and pass token
                console.log(req.body.fbid);
                var userModel = new UserVoted();
                userModel.fbid = req.body.fbid;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, config.secret);
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                })
                    
            }
        }
    });
});





// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);