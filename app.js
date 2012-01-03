
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'rutkosessionsecret' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/rutkogolf');

mongoose.connection.on("open", function(){
  console.log("mongodb is connected!!");
});

require('./model/posts')(mongoose, Schema) ;


/*
var posts = [
  {title:'Rutko Golf date set!', date:'10/01/2011', author: 'Tom Esposito', content: 'Hello! The date is set!'},
  {title:'Rutko Golf is over!', date:'10/11/2011', author: 'Tom Esposito', content: 'Hooray, the outing is over!'}
] ;
*/

var sponsors = [
  {name: 'Dr. Bob', website: 'http://www.drbob.com'},
  {name: 'Supreme Lobster', website: 'http://www.supremelobster.com'}
] ;

//Session
//dynamic helpers
app.dynamicHelpers({
    session: function (req, res) {
        return req.session;
    }
});
//validate session
function isAuthenticated(req, res, next){
  req.session.username?next():res.redirect('/login');
}

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'RutkoGolf',
    posts: postarr
  });
});
app.get('/about', function(req, res){
  res.render('about', {
    title: 'about'
  });
});
app.get('/sponsors', function(req, res){
  res.render('sponsors', {
    title: 'sponsors',
    sponsors: sponsors
  });
});
app.get('/photos', function(req, res){
  res.render('photos', {
    title: 'photos'
  });
});
app.get('/contact', function(req, res){
  res.render('contact', {
    title: 'contact'
  });
});
app.get('/signup', function(req, res){
  res.render('signup', {
    title: 'signup'
  });
});
app.get('/donate', function(req, res){
  res.render('donate', {
    title: 'donate'
  });
});
app.post('/login', function(req, res){
  //TODO: replace with actual login function
    if(req.body.user == 'espotw' && req.body.pass == 'test'){
      req.session.username = req.body.user;
      req.session.fname = 'Tom' ;
      req.session.name = 'Tom Esposito' ;
      res.redirect('/');
    }else{
      res.render('login', {
        title: 'login',
        fail: true
      });
    }
});
app.get('/login', function(req, res){
  res.render('login', {
    title: 'login',
    fail: false
  });
});
app.get('/logout', function(req, res){
  if (req.session) {
    req.session.destroy(function() {});
  }
  res.redirect('/');
});
app.get('/user', isAuthenticated, function(req, res){
  res.render('user', {
    title: 'Welcome back, '+req.session.fname
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
