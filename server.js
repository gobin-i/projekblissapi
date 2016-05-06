// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var helmet = require('helmet');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose    = require('mongoose');
var jwt        = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config     = require('./config');
var UserVoted       = require('./app/models/userVoted');
var Users       = require('./app/models/Users');
var Finalist       = require('./app/models/finalist');
var facebook = require('./app/models/facebook');
var request = require('request');
var https = require('https');


var port = process.env.PORT || 8080;        // set our port
mongoose.connect(config.database);
app.set('superSecret', config.secret);
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// http-header prevention
app.use(helmet());
app.use(helmet.noCache());
//log
app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});


//disable x-powered-by
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// API Magic happens here guys

// auth route
// authenticate and if fbid dont exist, passback token
router.route('/authenticate')
.post(function(req, res) {
    var accessToken = '1124095634309355';
    console.log('fbid here '+req.body.fbid);
    https.get("https://graph.facebook.com/"+req.body.fbid+"?access_token=1124095634309355|7fa9b6c3521add6e4d3b910e716db51c",function(response)
        {
            if (response.statusCode == 200) {
            //console.log(body)  
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
                    }); 
                } else {
                    //dont exist so we pass token to client localstorage
                    console.log(req.body.fbid);
                    
                        token = jwt.sign(user, config.secret, {
                            expiresIn: '20m'
                        });
                        console.log(token);
                            res.json({
                                type: true,
                                data: 'authentication process done',
                                token: token
                            });
                        
                    
                }
            }
            }); //.UserVoted
        }else{
            console.log(response.statusCode);
            res.json({
                                type: false,
                                data: 'Bad Request'
                                
            });
        }
        }
    )
    
    
    
});

// finalist route
router.route('/finalist')
    // post new finalist
    .post(function(req, res) {
        
        var finalistModel = new Finalist(); 
        finalistModel.name = req.body.name;

        finalistModel.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'finalistModel created!' });
        });
        
    })
    // list all finalist
    .get(function(req, res) {
        Finalist.find(function(err, finalists) {
            if (err)
                res.send(err);

            res.json(finalists);
        });
    });

// GET single finalist
router.route('/finalist/:finalist_id')

    .get(function(req, res) {
        Finalist.findById(req.params.finalist_id, function(err, finalist) {
            if (err)
                res.send(err);
            res.json(finalist);
        });
    });
// Increment finalist vote by finalist id and insert user submission
router.route('/vote')
    .put(ensureAuthorized,function(req, res) {

        // find finalist match id with body data request
        Finalist.findById(req.body.fid, function(err, finalist) {

            if (err)
                res.json({
                type: false,
                data: "Error occured: " + err
            });

            //increment finalist vote
            finalist.vote = (finalist.vote + 1);
            
            // save vote
            finalist.save(function(err) {
                if (err)
                    res.json({ type: false, data: "Error occured: " + err });
                
                // update finalist by request id and insert user submission
                Finalist.findByIdAndUpdate(
                    req.body.fid,
                    {$push: {"voters": {name: req.body.name, ic: req.body.ic, phone: req.body.phone, email:req.body.email, slogan:req.body.slogan, ans1:req.body.ans1, ans2:req.body.ans2, subscribe:req.body.subscribe}}},
                    {safe: true, upsert: true, new : true},
                    function(err, model) {
                        if (err)
                            res.json({
                            type: false,
                            data: "Error occured: " + err
                            });

                        var userModel = new UserVoted();
                        userModel.fbid = req.body.fbid;
                        userModel.save(function(err, user) {
                            res.json({
                                type: true,
                                data: 'Vote Updated!',
                                
                            });
                        
                        })

                    }
                );



                //res.json({ type: true, data: 'Vote Updated!' });
            });

        });
    });

// Ensure user send request with auth token inside header
function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        //verify token expiration
        jwt.verify(bearerToken, config.secret, function(err, decoded) {
            if (err) {
                res.json({
                    type: false,
                    data: "Token expired"
                });

            }else{
               req.token = bearerToken;
               next(); 
            }
        });
        
    } else {
        res.send(403);
    }
}

// catch error
process.on('uncaughtException', function(err) {
    console.log(err);
});
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);