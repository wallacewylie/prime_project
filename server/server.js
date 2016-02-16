var express = require("express");
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var index = require("./routes/index");
var mongoose = require("mongoose");


var port = process.env.PORT || 3000;

app.use(express.static('server/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', index);

//DB STUFF
var mongoURI = "mongodb://wallace.wylie@gmail.com:Beatles65@ds011248.mongolab.com:11248/artists";
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.once('open', function(){
    console.log("Mongo is connected!");
});


var artistSchema = new mongoose.Schema({
    name: String,
    descript: String
});

var Artist = mongoose.model('Artist', artistSchema);

//ROUTES
app.get("/artist/grab", function(req,res){
    Artist.find({}, function(err, artists){
        if(err){
            response.sendStatus(401);
            console.log(401);
        }
        //res.send(artists);
        console.log(artists.length);

        res.send(artists);
    });
});


var server = app.listen(port, function(){
    var port = server.address().port;
    console.log('Listening on port: ', port);
});

