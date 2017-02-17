
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

app.set('view engine', 'pug');

app.get('/details.html', function(req, res) {
	var classlist = [];

	// Connect to MySQL database.
	

	// Do the query to get data.
	con.query('SELECT * FROM user_details.class_details', function(err, rows, fields) {
	  	if (err) {
	  		
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		// Loop check on each row
	  		for (var i = 0; i < rows.length; i++) {

	  			// Create an object to save current row's data
		  		var classname = {
		  			'classname':rows[i].classname		  			
		  		}
		  		console.log(classname);
		  		// Add class object into array
		  		classlist.push(classname);
	  	}

	  	// Render index.pug page using array 
	  	res.render('details', {"classlist": classlist});
	  	}
	});


	
	
});


app.post("/details", urlEncodedParser, function(req, res) {
  
  var body = req.body;
    con.query("select * from user_details.class_details where classname = '"+body.class_name+"'", function(error, result, field) {
    if(error) {
        console.log(error);
    } else if(result.length>0) {
        console.log(result); 
      console.log("Class Already Exits");
      response.redirect('/error.html?user=yes');
      
    } else {
    var postVars = {classname: body.class_name, class_description: body.description};
    var query = con.query('INSERT INTO user_details.class_details SET ?', postVars, function(err, result) {
  		if(err) {
  			res.sendFile( path.join(__dirname + '/error.html'));
  			throw err;
  		}
	});
	console.log(query.sql);
   res.sendFile( path.join(__dirname + '/success.html'));
    }
});
	
});





app.get('/error.html/:user', function(req, res) {

 res.send("User already exists");


});
app.use(bodyParser.text());

// Form Post
app.post("/sigup.html", urlEncodedParser, function(request, response) {
 
  if(request.body.Login=="Signup") {
  	console.log("Sign Up activated");
    
    var body = request.body;
    con.query("select * from user_details.User_Registration where username = '"+body.usernamesignup+"'", function(error, result, field) {
    if(error) {
        console.log(error);
    } else if(result.length>0) {
        console.log(result);  //displays '[]'
      console.log("User Already Exits");
      response.redirect('/error.html?user=yes');
      
    } else {
    var postVars = {username: body.usernamesignup, email_id:body.emailsignup, password: body.passwordsignup};
    var query = con.query('INSERT INTO user_details.User_Registration SET ?', postVars, function(err, result) {
  		if(err) {
  			response.sendFile( path.join(__dirname + '/error.html'));
  			throw err;
  		}
	});
	console.log(query.sql);
   response.sendFile( path.join(__dirname + '/success.html'));
    }
});

        
    
  } else if (request.body.login=="Login") {
  	console.log("Login activated");
   var  body = request.body;
   console.log(body.username+": username");
   con.query("SELECT * FROM user_details.User_Registration WHERE username='"+body.username+"'", function(err, res, fields){
    if(err) { 
     response.sendFile( path.join(__dirname + '/error.html'));
    } else {
		console.log(res[0].password);
     
      if(body.password===res[0].password) {
       console.log("authorised user");
       response.sendFile( path.join(__dirname + '/details.html'));
      } else {
       console.log("not an authorised user");
       response.sendFile( path.join(__dirname + '/error.html'));
      }
     
    }
   });
  }
 
});

app.post("/login.html", urlEncodedParser, function(request, response) {
 
  if (request.body.login=="Login") {
  	console.log("Login activated");
   var  body = request.body;
   console.log(body.username+": username");
   con.query("SELECT * FROM user_details.User_Registration WHERE username='"+body.username+"'", function(err, res, fields){
    if(err) { 
     response.sendFile( path.join(__dirname + '/error.html'));
    } else {
		console.log(res[0].password);
     
      if(body.password===res[0].password) {
       console.log("authorised user");
       response.redirect('/details.html');
      } else {
       console.log("not an authorised user");
       response.sendFile( path.join(__dirname + '/error.html'));
      }
     
    }
   });
  }
 
});

app.listen(3000);