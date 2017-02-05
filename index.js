
//Library module for SQL
var mysql = require("mysql");

//Library Module for Express
var express = require("express");
var app = express();

//Library module for body parser
// body-parser
var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});
var path = require("path");




// DB Connection
var con = mysql.createConnection({
  host: "localhost",
  user:"root",
  password: "harry14",
  port:"3301",
  database:"User_details"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db'+err);
    return;
  }

  console.log('Connection established');

  con.query('SELECT * from user_details.User_Registration', function(err, recordset) {
        // ... error checks 
 
        console.dir(recordset);
    });
 
});

app.use(function(req,res,next){
	console.log(`${req.method} request for ${req.url}`);
	next();

});

app.use(express.static("./"));

app.get("/", function(req, res) {
	 res.sendFile(path.join(__dirname + '/index.html'));
	 
      
    
});





app.use(bodyParser.text());

// Form Post
app.post("/", urlEncodedParser, function(request, response) {
 
  if(request.body.Login=="Signup") {
  	console.log("Sign Up activated");
    
    var body = request.body;
    var date = new Date();
     
    var postVars = {name: body.usernamesignup, password: body.passwordsignup};
    var query = con.query('INSERT INTO user_details.User_Registration SET ?', postVars, function(err, result) {
  		if(err) {
  			response.sendFile( path.join(__dirname + '/error.html'));
  			throw err;
  		}
	});
	console.log(query.sql);
   response.sendFile( path.join(__dirname + '/success.html'));
  } else if (request.body.Login=="Login") {
   var  body = request.body;
   console.log(body.username+": username");
   connection.query("SELECT * FROM REG_NODEJS WHERE username='"+body.username+"'", function(err, res, fields){
    if(err) { 
     response.sendFile( "/js/nodejs/folder1/unauthorised.html");
    } else {
     bcrypt.compare(body.pwd, res[0].password, function(err, res) {
      if(res) {
       console.log("authorised user");
       response.sendFile( "/js/nodejs/folder1/authorised.html");
      } else {
       console.log("not an authorised user");
       response.sendFile( "/js/nodejs/folder1/unauthorised.html");
      }
     });
    }
   });
  }
 
});

app.listen(3000);