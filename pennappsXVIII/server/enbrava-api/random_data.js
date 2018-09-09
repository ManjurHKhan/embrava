#!/usr/bin/nodejs

const DB_NAME = "endrava";
const MS_IN_MIN = 60000;
var client = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
const ACCOUNT_ID = "6448450";
function insertDistraction() {
    client.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        var startTime = new Date();
        var endTime = new Date(startTime + 3000);
        var myobj = {"accountId": ACCOUNT_ID,
                "startTime": startTime,
                "endTime": endTime}
        dbo.collection("distractions").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}
insertDistraction();
