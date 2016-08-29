var express = require("express");
var bodyParser = require("body-parser");
var Firebase = require("firebase");
var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App  running on port: ", port);
});


