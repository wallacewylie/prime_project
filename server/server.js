var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var index = require("./routes/index");

var port = process.env.PORT || 3000;

app.use(express.static('server/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', index);

var server = app.listen(port, function(){
    var port = server.address().port;
    console.log('Listening on port: ', port);
});

