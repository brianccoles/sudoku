

var express = require('express');
const SudokuSolver = require("./SudokuSolver.js");
const SudokuDatabase = require("./SudokuDatabase.js");

var solver = new SudokuSolver();
// console.log(solver);

var app = express();
app.set('view engine', 'pug');
app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/puzzle', function(req, res){
  //  res.redirect("http://127.0.0.1:"+port+"/index.js");    /*  "/Users/brian/Projects/sudoku/src"} */
  res.render("index");
});

// =========  CRUD methods ============
//  The table:  create table sudoku (id serial AUTO_INCREMENT, title varchar(255), entryDate timestamp, puzzle varchar(255));
app.post('/create', function(req, res){
  //  do the insert for a new row and returning the ID.  Get the JSON for the row from the post parameter
  //  Add the current date and time.
  let inData = "";
  req.on('data', chunk => {
    console.log("chunk: " + chunk)
    inData += chunk.toString();
  });
  req.on('end', () => {
    console.log("Indata to server: >" + inData + "<");
    // var body = querystring.parse(inData);
    // console.log(body);
    var dbHelper = new SudokuDatabase();
    dbHelper.InsertRecord(inData, res);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // res.end("Puzzle inserted");
  });
});

app.patch('/update', function(req, res){
  //  do an Update statement to add a comment to the entry.

});

app.get('/fetch', function(req,res) {
  var dbHelper = new SudokuDatabase();
  var inData = req.query.id;
  dbHelper.FetchAllEntries(res);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');

});

app.get('/read', function(req, res){
  var dbHelper = new SudokuDatabase();
  var inData = req.query.id;
  dbHelper.FetchOneEntry(inData, res);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');


});

app.get('/delete', function(req, res){
    let inData = req.query.id;

    console.log("Indata to server for delete: >" + inData + "<");
    // var body = querystring.parse(inData);
    // console.log(body);
    var dbHelper = new SudokuDatabase();
    dbHelper.DeleteRecord(inData, res);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.end("Puzzle deleted");

});

// ============================
app.post('/solve', function(req,res) {
  console.log("in post for /solve");
  //  res.send('[[3,0,5,0,0,2,0,6,0],[0,0,0,0,0,0,0,1,0],[0,0,4,0,6,7,9,0,0],[0,0,0,0,4,5,0,0,9],  [0,0,0,0,0,0,0,0,0],[9,0,0,2,1,0,0,0,0],[0,0,2,7,8,0,1,0,0],[0,1,0,0,0,0,0,0,0],[0,8,0,4,0,0,7,0,3]]');

  console.log("Method = " + req.method);
  if (req.method === "POST") {
    console.log("URL = " + req.url);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');

    let inData = "";
    req.on('data', chunk => {
      console.log("chunk: " + chunk)
      inData += chunk.toString();
    });
    req.on('end', () => {
      console.log("Indata to server: >" + inData + "<");
      // var body = querystring.parse(inData);
      // console.log(body);


      var runner = new SudokuSolver();
      // var sample = "[[3,0,5,0,0,2,0,6,0],[0,0,0,0,0,0,0,1,0],[0,0,4,0,6,7,9,0,0],[0,0,0,0,4,5,0,0,9],  [0,0,0,0,0,0,0,0,0],[9,0,0,2,1,0,0,0,0],[0,0,2,7,8,0,1,0,0],[0,1,0,0,0,0,0,0,0],[0,8,0,4,0,0,7,0,3]]";
      runner.SetGivens(JSON.parse(inData));


      if (runner.FindSolution()) {
        res.end(JSON.stringify(runner.solution));
      } else {
        res.end("No solution found");
      }
      //console.log(res);

      console.log("server hit at " + (new Date()).toString());
    });

  }



});
var port = 8081
app.listen(port, function() {
  console.log('Example app listening on port ' + 8081);
});



/*
import React from 'react';
import logo from './logo.svg';
import './App.css';

var router = require('./RouteTester.js');

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/