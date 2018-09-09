/*
    This is a temporary solution where I am putting the function to the distraction endpoint
*/

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
