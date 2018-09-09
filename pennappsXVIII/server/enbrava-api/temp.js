const express = require("express")
const app = express()
const docusign = require("docusign-esign");
const apiClient = new docusign.ApiClient();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var client = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/mydb";
app.listen(9000, () => console.log("Listening on port 3000"));

app.post("/distraction", (req, res)) => 
    client.connect(url, => (err, db) {
        if (err) throw err;
        console.log("success!!");
        db.then(function(db_n){
            delete req.body._id;
            db_n.collection('distractoion').insertOne(req.body);
        });
        res.send('Data received:\n' + JSON.stringify(req.body));
    }
