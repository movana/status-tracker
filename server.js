var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();


app.use(serveStatic("app"));
app.use('/build', serveStatic("app/build"));
app.use('/static/angular', serveStatic("node_modules/angular"));
app.listen(8080, function(){
    console.log('Server running on 8080...');
});