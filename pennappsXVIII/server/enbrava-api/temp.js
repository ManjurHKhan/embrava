const express = require("express");
const app = express();
const docusign = require("docusign-esign");
const apiClient = new docusign.ApiClient();
const bodyParser = require('body-parser');
const DB_NAME = "endrava";

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());

var client = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/mydb";
app.listen(9000, () => console.log("Listening on port 9000"));

app.post('/distraction', function(req, res) {
    client.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        //delete req.bodt._id;
        var myobj = req.body;
        //var myobj = { name: "Company Inc", address: "Highway 37" };
        dbo.collection("distractions").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
    /*client.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = { "userId" : "t5y5ehrfqgar" };
        dbo.collection("distractions").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log("\n\n\n");
            console.log(result);
            db.close();
        });
    });*/
    res.send('done');
});

/*
app.post('/distraction', function (req, res) {
    dbConn = client.connect(url);// function(err, db) {
    
        dbConn.then(function(n_db) {
            delete req.body._id;
            n_db.collection('distractions').insertOne(req.body);
        });
    res.send('Data received:\n' + JSON.stringify(req.body));
    dbConn.collection('teams', function(err, collection) {
        if(!err) {
            console.log(collection);
        } else {
            console.log("error");
        }
    });
    dbConn.close();
});
*/
