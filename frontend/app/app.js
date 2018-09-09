var express = require('express');

var app = express();
app.set('port', 3005);
app.use(express.static('app/public'));
app.use(require('./routes/index-route'));
app.set('view engine', 'ejs');
app.set('views', 'app/views');

var server = app.listen(app.get('port'), function(){
    console.log("listening on port " + app.get('port'));
});
