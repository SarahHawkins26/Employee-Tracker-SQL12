const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database:'employee_tracker_db'
});

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(results);
        startQuestions();
    });
}

function viewAllRoles() {
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(results);
        startQuestions();
    });
}

function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(results);
        startQuestions();
    });
}

function startQuestions() {
    const questions = [
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: [
                'View All Deparments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Update an Employee Manager',
                'Delete an Employee',
                'Exit',
            ],
        },
    ];

    inquirer.prompt(questions).then((answers) => {
            if (answers.option === 'View All Departments') {
                viewAllDepartments();
            } else if (answers.option === 'View All Roles') {
                viewAllRoles();
            } else if (answers.option === 'View All Employees') {
                viewAllEmployees();
            } else if (answers.option === 'Add a Department') {
                addDepartment();
            } else if (answers.option === 'Add a Role') {
                addRole();
            } else if (answers.option === 'Add an Employee') {
                addEmployee();
            } else if (answers.option === 'Update an Employee Role') {
                updateEmployeeRole();
            } else if (answers.option === 'Update an Employee Manager') {
                updateEmployeeManager();
            } else if (answers.option === 'Delete an Employee') {
                deleteEmployee();
            } else if (answers.option === 'Exit') {
                exitApp();
            }
        });
    }

    function addDepartment(){
        inquirer.prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the department:'
            },
        ])
        .then((answers) => {
            const departmentName = answers.departmentName;
            connection.query('INSERT INTO department (name) VALUES (?)',
            [departmentName], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`Department '${departmentName}' added successfully`);
                startQuestions();
            }
            );
        });
    };

    function addRole() {
        inquirer.prompt([
            {
            type: 'input',
            name: 'roleTitle',
            message: 'Enter title of the role:',
            },
            {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary of the role:',
            },
            {
            type: 'input',
            name: 'departmentId',
            message: 'Enter the department ID of the role:',
            },
        ])
        .then((answers) => {
            const {roleTitle, roleSalary, departmentId} = answers;
            connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
            [roleTitle, roleSalary, departmentId], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`Role '${roleTitle} added successfully!`);
                startQuestions();
            }
        );
        });
    }

    function addEmployee() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "Enter the employee's first name:",
            },
            {
                type: 'input',
                name: 'lastName',
                message: "Enter the employee's last name:",
            },
            {
                type: 'input',
                name: 'roleId',
                message: "Enter the employee's role ID:",
            },
            {
                type: 'input',
                name: 'managerId',
                message: "Enter the employee's manager ID (leave blank if employee has no manager):",
            },
        ])
        .then((answers) => {
            const {firstName, lastName, roleId, managerId} = answers;
            connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [firstName, lastName, roleId, managerId], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`Employee '${firstName} ${lastName}' added successfully!`);
                startQuestions();
            }
            );
        });
    }

    function updateEmployeeRole(){
        inquirer.prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: "Enter the employee's ID:",
            },
            {
                type: 'input',
                name: 'newRoleId',
                message: "Enter the new role ID for the employee:",
            },
        ])
        .then((answers) => {
            const {employeeId, newRoleId} = answers;
            connection.query('UPDATE employee SET role_id = ? WHERE id = ?',
            [newRoleId, employeeId], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`Employee with ID ${employeeId} has been updated with a new role.`);
                startQuestions();
            }
            );
        });
    }

    function exitApp() {
        console.log('You have exited Employee Tracker, goodbye!');
        connection.end();
        process.exit();
    }

    connection.connect((err) => {
        if (err) {
            console.error('Failed to connect to database:', err);
        }
        console.log('Connected to database!');
        startQuestions();
    });