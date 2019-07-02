//require inquirer, chalk and connection.js file
var inquirer = require("inquirer");
var chalk = require("chalk");
var connection = require("./connection.js");

// make sure it's connected to my local database by a console.log
// display items
connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    exit();
  });

// exit function
function exit(){
    connection.end();
}