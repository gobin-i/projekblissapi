var https = require('https');
var request = require('request');
exports.get = function(accessToken, fbid, callback) {
    // creating options object for the https request
    
    request('https://graph.facebook.com/'+fbid+'?access_token=' + accessToken + '|7fa9b6c3521add6e4d3b910e716db51c', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the Google homepage. 
        }else{
            console.log(body);
        }
    })

    /*
    var options = {
        // the facebook open graph domain
        host: 'graph.facebook.com',

        // secured port, for https
        //port: 443,

        // apiPath is the open graph api path
        path: fbid + '?access_token=' + accessToken + '|7fa9b6c3521add6e4d3b910e716db51c',

        // well.. you know...
        method: 'GET'
    };

    // create a buffer to hold the data received
    // from facebook
    var buffer = '';


    // initialize the get request
    var request = https.get(options, function(result){
        //console.log(result);
        result.setEncoding('utf8');

        // each data event of the request receiving
        // chunk, this is where i`m collecting the chunks
        // and put them together into one buffer...
        result.on('data', function(chunk){
            buffer += chunk;
            //console.log('data: '+ chunk);
        });

        // all the data received, calling the callback
        // function with the data as a parameter
        result.on('end', function(){
            callback(buffer);
        });
    });
    
    // just in case of an error, prompting a message
    request.on('error', function(e){
        console.log('error from facebook.get(): '
                     + e.message);
    });
*/
    //request.end();
    
}