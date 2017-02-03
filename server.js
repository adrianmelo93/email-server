var express = require('express');
var webApp = express();
var bodyParser = require('body-parser');
var nodeMailer = require('nodemailer');
var fs = require('fs');
var cors = require('cors');

var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adrianmelo123093@gmail.com',
    pass: 'amb123093'
  }
});
webApp.use(cors());
webApp.use(bodyParser.json());
webApp.use(bodyParser.urlencoded({extended: true}))

webApp.get('/', function(req, res) {
  res.send("hello world");
});

// webApp.get('/:num1/num2', function(req, res) {
//   var n1 = req.params.num1;
//   var n2 = req.params.num2;
//   var sum = Number(n1) + Number(n1);
// });


// webApp.post('/email', function(req, res){
//   res.send("this is a post route");
// });


webApp.post('/email', function(req, res){
  var postedData = req.body;
  // res.json(postedData);
  transporter.sendMail({
    from: 'adrianmelo123093@gmail.com',
    to: postedData.to,
    subject: 'this is a test',
    html: postedData.msg
  },
  function(err, info){
if(err) {
  console.log(JSON.stringify(err));
  return res.sendStatus(500);
}
console.log(JSON.stringify(info));
res.json(info);
  });
});



webApp.post('/resume', function (req, res) {
  if(!req.body || !req.body.destination_email) {
    console.log("recived a bad request");
    res.sendStatus(400);
    return;
  }
  fs.readFile('./resume.html', 'utf8', function(err, contents) {
    if(err) {
      console.log(JSON.stringify(err));
       res.sendStatus(500);
      return;
    }
    transporter.sendMail({
      to: req.body.destination_email,
      subject: 'this is a test for the resume',
      html: contents
    },
    function(err, info){
  if(err) {
    console.log(JSON.stringify(err));
    return res.sendStatus(500);
  }
  console.log(JSON.stringify(info));
  res.json(info);
    });
  });
});
webApp.get('/resume-emailer', function(req, res) {
fs.readFile('./resume-emailer.html', 'utf8', function(err, contents){
  res.end(contents);
})
});

webApp.listen(8967);
console.log('server listening');
