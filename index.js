//require inquirer, chalk and connection.js file
var inquirer = require("inquirer");
var chalk = require("chalk");
var connection = require("./connection.js");

// make sure it's connected to my local database by a console.log
// display items
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    promptAction();
});

function promptAction() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }]).then(function (response) {
        switch(response.action) {
            case "View Products for Sale":
              viewProducts(displayProducts);
              break;
            case "View Low Inventory":
              viewLowInventory();
              break;
            case "Add to Inventory":
              addToInventory();
              break;
            case "Add New Product":
              addNewProduct();
              break;
            case "Exit":
                exit();
              break;
            default:
            exit();
          }
    });
}

//  write a function that returns the items in the database for the customer to another function
function viewProducts(callback) {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        callback(res);
    });
}

// write a function that lists the products to the console
function displayProducts(productList) {
    console.log("-----------------------------------------");
    console.log(chalk.red("Id" + " | ") + chalk.yellow("Product" + " | ") + chalk.magenta("Department" + " | ") + chalk.green("Stock" + " | ") + chalk.blue("Price"));
    console.log("-----------------------------------------");
    productList.map(function (item) {
        let option = chalk.red(item.item_id + " | ") + chalk.yellow(item.product_name + " | ") + chalk.magenta(item.department_name + " | ") + chalk.green(item.stock_quantity) + chalk.blue(" | $" + item.price);
        console.log(option);
        return option;
    });
    promptAction();
}

// exit function
function exit() {
    connection.end();
}