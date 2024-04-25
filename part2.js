var http = require('http');
var url = require('url');
var query = require('querystring');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://juliamfy:1234@stock.oloh5ej.mongodb.net/?retryWrites=true&w=majority&appName=Stock';
const client = new MongoClient(url);
var port = process.env.PORT || 3000;
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  urlObj = url.parse(req.url,true)
  path = urlObj.pathname;
  //On home page, display the query form
  if (path == "/")
  {
    s = "<form action='/process' method='get'>"+
            "<label for='CompanyName'>Company Name:</label>"+
            "<input type='text' name='companyName'><br />" +
            "<label for='symbol'>Stock Ticker Symbol:</label>"+
            "<input type='text' name='symbol'><br />" +
            "<input type='submit'>" +
            "</form>";
	  res.write(s);
  }
  // when the process is launched
  else if (path == "/process")
  {
    //parse the url for the query
    var input = url.parse(req.url, true).query.name;
    var inputType = url.parse(req.url, true).query.type;
    //connect to the database 
    MongoClient.connect(url, function(err, db) {
        if(err) { 
            console.log("Connection err: " + err);
             return; 
        }
        
        var dbo = db.db("Stock");
        var coll = dbo.collection('PublicCompanies');
        
        // Perform action based on query 
        if(inputType == "companyName"){
            // perform name query 
            theQuery = {companyName:input}
            output = coll.find(theQuery);
        }
        else if(inputType == "symbol"){
            // perform symbol query 
            theQuery = {companyName:input}
            output = coll.find(theQuery);

        }

        output.toArray(function(err, items) {
    
          if (err) {
            console.log("Error: " + err);
          } 
          else 
          {
            console.log("Items: ");
            for (i=0; i<items.length; i++){
                console.log("Name: " + items[i].companyName +"<br>");
                console.log("Ticker: " + items[i].ticker +"<br>");
                console.log("Price: " + items[i].price +"<br>");
                res.write("Name: " + items[i].companyName +"<br>");
                res.write("Ticker: " + items[i].ticker +"<br>");
                res.write("Price: " + items[i].price +"<br>");
          }
            } // end else
          }) // to array
          db.close();
        });  //end mongoconnect		
    };  //end elseifpath
}).listen(port); //end create server