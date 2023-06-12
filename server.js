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
            console.log(err);
            return;
        }
        console.table(results);
    });
}

function viewAllRoles() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(results);
    });
}

function viewAllEmployees() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(results);
    });
}

function main() {
    const questions = [
        {
            type: 'list',
            name: 'option'
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
                'Exit'
            ]
        }
    ];

    function startQuestions() {
        inquirer.prompt(questions)
        .then((answers) => {
            if (answers.option)
        })
    }

    const mainMap = {
        'View All Deparments': viewAllDepartments,
        'View All Roles': viewAllRoles,
        'View All Employees': viewAllEmployees,
        'Add a Department': addDepartment,
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Update an Employee Manager',
        'Delete an Employee',
        'Exit'

    }
}

