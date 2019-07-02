//require inquirer, chalk and connection.js file
var inquirer = require("inquirer");
var chalk = require("chalk");
var connection = require("./connection.js");

let choices = [];

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
        switch (response.action) {
            case "View Products for Sale":
                viewProducts(displayProducts);
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                printProducts(addToInventory);
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

// write a function that lists all items with an inventory count lower than five

function viewLowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("-----------------------------------------");
        console.log(chalk.red("Id" + " | ") + chalk.yellow("Product" + " | ") + chalk.magenta("Department" + " | ") + chalk.green("Stock" + " | ") + chalk.blue("Price"));
        console.log("-----------------------------------------");
        for (let i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                let lowInvent = chalk.red(res[i].item_id + " | ") + chalk.yellow(res[i].product_name + " | ") + chalk.magenta(res[i].department_name + " | ") + chalk.green(res[i].stock_quantity) + chalk.blue(" | $" + res[i].price);
                console.log(lowInvent);
            }
        }
        promptAction();
    });
}

// write a function that adds more to the current inventory

function printProducts(callback){
    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function (err, res) {
        choices = [];
        if (err) throw err;
        for( let i = 0; i < res.length; i++) {
            let choice = res[i].item_id + " | " + res[i].product_name + " | " + res[i].stock_quantity + " \n";
            choices.push(choice);
        }
        callback(choices);
    });
}

function addToInventory(choices) {
    inquirer.prompt([{
        type: "list",
        message: "Add more of: ",
        name: "product",
        choices: [choices]
    }]).then(function (response) {
        console.log("yes");
    });
}

// write a function that adds a new item

function addNewProduct() {
    inquirer.prompt([{
            type: "input",
            message: "Product name: ",
            name: "productName"
        },
        {
            type: "input",
            message: "Department name: ",
            name: "depName"
        },
        {
            type: "input",
            message: "Price: ",
            name: "price"
        },
        {
            type: "input",
            message: "Stock Quantity: ",
            name: "stock"
        }
    ]).then(function (response) {
        connection.query("INSERT INTO products SET ?", {
                product_name: response.productName,
                department_name: response.depName,
                price: response.price,
                stock_quantity: response.stock
            },
            function (err, res) {
                if (err) throw err;
                console.log(chalk.green.bold("\n Product successfully inserted!\n"));
                promptAction();
            });
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