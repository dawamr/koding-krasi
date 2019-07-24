const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

// create express app
const app = express();

// Require Notes routes
require('./app/routes/note.route.js')(app);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

// parse requests of content-type - application/json
app.use(bodyParser.json())

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lat', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

// create model
var Schema=mongoose.Schema;
 
var commentSchema=new Schema({
  author:String,
  text:String
});
 
var Comment=mongoose.model("Comment",commentSchema);

app.get('/',(req,res)=>{
  Comment.find({}, (error, data)=>{
    if(error)
      return res.send(error);
    res.json(data);
  });
});

app.get('/add', function(req,res){
  var newComment = new Comment({
    'author' : 'Dawam Raja H',
    'text' : 'Sedang Belajar 2...'
  });
  newComment.save(function(error){
    if(error)
      return res.send(error);
    res.send('saved');
  });
});

app.get('/findByField',(req, res)=>{
  Comment.find({'author' : 'Dawam Raja'},(error, data)=>{
    if(error)
      return res.send(error);
    res.json(data);
  });
})

app.get('/findById',(req, res)=>{
  Comment.findById('5d37bef3e92c9a25be06c5c8',(error, data)=>{
    if(error)
      return res.send(error);
    res.json(data);
  });
})

app.get('/updateById2',(req, res)=>{
  Comment.findByIdAndUpdate('5d37bef3e92c9a25be06c5c8',{'text':'Istirahat'},(error, data)=>{
    if(error)
      return res.send(error);
    res.send('Updated');
  });
})
app.get('/updateById',(req, res)=>{
  Comment.findById('5d37bef3e92c9a25be06c5c8',(error, data)=>{
    if(error)
      return res.send(error);
    data.text ='Sudah Belajar' 
    data.save((error)=>{
      if(error)
      return res.send(error);
      res.json(data)
    })
  });
})

app.get('/updateByField',(req, res)=>{
  Comment.findOneAndUpdate({'author':'Dawam Raja'},{'author':'Dawam Rajaa','text':'Sekarang belajar lagi'},(error, data)=>{
    if(error)
      return res.send(error);
    res.send('Updated');
  });
})

app.get('/findIdBeforeDelete',(req, res)=>{
  Comment.findById('5d37c9b11c0ba458c94e158a',(error) => {
    if(error)
      return res.send(error);
    res.send('deleted')
  });
});

app.get('/findByIdAndRemove',()=>{
  Comment.findByIdAndRemove('5d37c9b11c0ba458c94e158a', (error)=>{
    if(error)
      return res.send(error);
    res.send('deleted')
  })
})

app.get('/deleteByField',(req,res)=>{
  Comment.findOneAndRemove({'author':'Anonim'},(error)=>{
    if(error)
      return res.send(error);
    res.send('deleted');
  })
});

app.get('/example/b',(req, res, next) => {
    next()
  }, (req, res)=>{
    res.send('Hello from B!')
})

var sess;

app.get('/login',(req,res)=>{
  res.sendFile(__dirname + '/index.html');
});

app.post('/login',(req,res)=>{
  sess = req.session;
  sess.email = req.body.email;
  sess.pass = req.body.pass;
  res.send('done');
});

route.get('/admin',(req,res) => {
  sess = req.session;
  if(sess.email && sess.pass == 'rahasia') {
    res.send('success');
  }
  else {
      res.write('<h1>Please login first.</h1>');
      res.send('<a href='+'/'+'>Login</a>');
  }
});

route.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      res.redirect('/');
  });

});








// define a simple route
// app.get('/', (req, resp) => {
//    resp.json({
//        name: "dawam",
//        age: 18
//    });
// });

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});