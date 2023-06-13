const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
require('dotenv').config();

//create connection to Mysql database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database:'employee_tracker_db'
});

//function to start initial questions
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
};

//function to view all departments
function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(results);
        startQuestions();
    });
};

//function to view all roles
function viewAllRoles() {
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(results);
        startQuestions();
    });
};

//function to view all employee's
function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(results);
        startQuestions();
    });
};

//function to add department
function addDepartment(){
        inquirer.prompt(
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the department:'
            },
        )
        .then((answers) => {
            const departmentName = answers.departmentName;
            connection.query('INSERT INTO department SET ?', {dep_name: departmentName}, (err, results) => {
                if (err) {
                    console.error(err);
                    return;
                }
                viewAllDepartments();
                console.log(`Department '${departmentName}' added successfully`);
            }
            );
        });
};

//function to add roles
function addRole() {
    const department = [];
    connection.query('SELECT * FROM department', (err, res) => {
        res.forEach(depart => {
            let departInfo = {
                name: depart.dep_name,
                value: depart.id
            };
            department.push(departInfo);
        });
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
            const roleTitle = answers.roleTitle;
            connection.query('INSERT INTO roles SET ?', {
                title: roleTitle, 
                salary: answers.roleSalary, 
                department_id: answers.departmentId
            }, (err, results) => {
                if (err) {
                    console.error(err);
                    return;
                }
                viewAllRoles();
                console.log(`Role '${roleTitle} added successfully!`);
            });
        });
    });
};

//function to all employees
function addEmployee() {
    connection.query('SELECT * FROM roles', (err, roleResponse) => {
        const roles = [];
        roleResponse.forEach(({ title, id }) => {
            roles.push({
                name: title,
                value: id
            });
        });
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
            const firstName =answers.firstName;
            const lastName = answers.lastName;
            connection.query('INSERT INTO employee SET ?', {
                first_name: firstName, 
                last_name: lastName, 
                role_id: answers.roleId, 
                manager_id: answers.managerId
            }, (err, results) => {
                if (err) {
                    console.error(err);
                    return;
                }
                viewAllEmployees();
                console.log(`Employee '${firstName} ${lastName}' added successfully!`);
            });
        });
    });
};

//update employees role
function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', (err, employeeRes) => {
        const employeeChoices = employeeRes.map(({ id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

    connection.query('SELECT * FROM roles', (err, roleRes) => {
        const roleChoices = roleRes.map(({ id, title }) => ({
            name: title,
            value: id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Enter the employee you want to update:",
                choices: employeeChoices
            },
            {
                type: 'list',
                name: 'newRole',
                message: "Enter the new role to update for the employee:",
                choices: roleChoices
            },
        ])
        .then((answers) => {
            connection.query(`UPDATE employee SET role_id = ${answers.newRole} WHERE id = ${answers.employee}`, (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                viewAllEmployees();
                console.log(`Employee with ID ${answers.employee} has been updated with a new role.`);
            }
            );
          });
      });
    });
}

//quit application
function exitApp() {
        console.log('You have exited Employee Tracker. Goodbye!');
        connection.end();
        process.exit();
};

//connection to the database and start of the application
connection.connect((err) => {
        if (err) {
            console.error('Failed to connect to database:', err);
        }
        startQuestions();
        console.log('Connected to database!');
});