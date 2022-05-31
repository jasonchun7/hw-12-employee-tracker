const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: "rootroot",
  database: "employeesDB",
});

connection.connect(function (err) {
  if (err) console.log(err);

  startPrompt();
});

function startPrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "What would you like to do? Please select from the list.",
      choices: [
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then(function ({ task }) {
      switch (task) {
        case "View All Departments":
          viewDepartment();
          break;
        case "View all Roles":
          viewRoles();
          break;
        case "View all Employees":
          viewEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

function viewDepartment() {
  var query = `SELECT * FROM department`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startPrompt();
  });
}

function viewRoles() {
  var query = `SELECT role.id, role.title, role.salary, role.department_id, department.id, department.name FROM role LEFT JOIN department on role.department_id = department.id`

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startPrompt();
  })
}

function viewEmployees() {
  var query = `SELECT employee.employee_id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.role_id LEFT JOIN department on role.department_id = department.department_id LEFT JOIN employee manager on manager.manager_id = employee.manager_id;`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startPrompt();
  });
}

function addDepartment() {}

function addRole() {
  var query =
  `SELECT d.id, d.name, r.salary AS budget
  FROM employee e
  JOIN role r
  ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  GROUP BY d.id, d.name`

connection.query(query, function (err, res) {
  if (err) throw err;

  const departmentChoices = res.map(({ id, name }) => ({
    value: id, name: `${id} ${name}`
  }));

  console.table(res);
  console.log("Department array!");

  promptAddRole(departmentChoices);
});
}

function promptAddRole(departmentChoices) {

inquirer
  .prompt([
    {
      type: "input",
      name: "roleTitle",
      message: "Role title?"
    },
    {
      type: "input",
      name: "roleSalary",
      message: "Role Salary"
    },
    {
      type: "list",
      name: "departmentId",
      message: "Department?",
      choices: departmentChoices
    },
  ])
  .then(function (answer) {

    var query = `INSERT INTO role SET ?`

    connection.query(query, {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.departmentId
    },
      function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Role Inserted!");

        firstPrompt();
      });

  });
}

function addEmployee() {
  var query = `SELECT r.id, r.title, r.salary FROM role r`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const roles = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);

    promptInsert(roles);
  });
}

function promptInsert(roles) {
  inquirer
  .prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?"
    },
    {
      type: "list",
      name: "roleId",
      message: "What is the employee's role?",
      choices: roles
    },
  ])
  .then(function (answer) {
    console.log(answer);

    var query = `INSERT INTO employee SET ?`
    // when finished prompting, insert a new item into the db with that info
    connection.query(query,
      {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: answer.roleId,
        manager_id: answer.managerId,
      },
      function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(res.insertedRows + "Inserted successfully!\n");

        startPrompt();
      });
  });
}

function updateEmployeeRole() {
  employeeArray();

}

function employeeArray() {
  console.log("Updating an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  JOIN employee m
	ON m.id = e.manager_id`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`      
    }));

    console.table(res);
    console.log("employeeArray To Update!\n")

    roleArray(employeeChoices);
  });
}

function roleArray(employeeChoices) {
  console.log("Updating an role");

  var query =
    `SELECT r.id, r.title, r.salary 
  FROM role r`
  let roleChoices;

  connection.query(query, function (err, res) {
    if (err) throw err;

    roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`      
    }));

    console.table(res);
    console.log("roleArray to Update!\n")

    promptEmployeeRole(employeeChoices, roleChoices);
  });
}

function promptEmployeeRole(employeeChoices, roleChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to set with the role?",
        choices: employeeChoices
      },
      {
        type: "list",
        name: "roleId",
        message: "Which role do you want to update?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {

      var query = `UPDATE employee SET role_id = ? WHERE id = ?`
      // when finished prompting, insert a new item into the db with that info
      connection.query(query,
        [ answer.roleId,  
          answer.employeeId
        ],
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Updated successfully!");

          firstPrompt();
        });
    });
}

