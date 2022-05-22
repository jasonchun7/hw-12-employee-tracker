const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'rootroot',
    database: 'employeeDB'
});

connection.connect(function (err) {
    if (err) throw err;

    initialPrompt();
})

function initialPrompt() {
    inquirer
    .prompt({
        type: 'list',
        name: 'task',
        message: 'What would you like to do? Please select from the list.',
        choices: [
            'View all Departments',
            'View all Roles',
            'View all Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update Employee Role',
            'Exit'
        ]
    })
    .then(function ({ task }) {
        switch (task) {
            case 'View All Departments':
                viewDepartment();
                break;
            case 'View all Roles':
                viewRoles();
                break;
            case 'View all Employees':
                viewEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    })
}

function viewDepartment() {

}

function viewRoles() {
    
}

function viewEmployees() {
    
}

function addDepartment() {
    
}

function addRole() {
    
}

function addEmployee() {
    
}

function updateEmployeeRole() {
    
}
