const mysql = require('mysql');
const inquirer = require('inquirer');

const VIEW_ALL_EMPL = "View ALL Employees";
const EMPL_BY_DEPT = "View All Employees By Department";
const EMPL_BY_MNGR = "View All Employees By Manager";
const ADD_EMPL = "Add Employee";
const REMOVE_EMPL = "Remove Employee";
const UPDATE_EMPL_ROLE = "Update Employee Role";
const UPDATE_EMPL_MNGR = "Update Employee Manager";

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    password: 'scottsqlthings',
    database: 'company_orgDB',
});

function start() {
    inquirer.prompt([
        {
            name: 'queryOption',
            type: 'list',
            message: 'Choose an option!',
            choices: [VIEW_ALL_EMPL, EMPL_BY_DEPT, EMPL_BY_MNGR, ADD_EMPL, REMOVE_EMPL, UPDATE_EMPL_ROLE, UPDATE_EMPL_MNGR]
        }
    ]).then(answers => {

        const { queryOption } = answers;

        switch (queryOption) {
            case VIEW_ALL_EMPL:
                console.log('Nice');
                // call function that displays all employees and then starts the start() function again.
                break;
            case EMPL_BY_DEPT:
                // Call function with inquirer prompt that lists all departments for you to choose from, .then(answers) will then have it's own switch statement and will display employees based on the department the user chose.
                break;
            case EMPL_BY_MNGR:
                // Call function with inquirer prompt that lists all managers for you to choose from, .then(answers) will then have it's own switch statement and will display employees based on the manager the user chose.
                break;
            case ADD_EMPL:
                // Call function with inquirer prompt that has the user fill out the employee info, then .then() will add this emplyoee to the employee table
                break;
            case REMOVE_EMPL:
                // Call function with inquirer prompt that lists all employees for you to choose from, the .then() will delete the user's choice from the employee table.
                break;
            case UPDATE_EMPL_ROLE:
                // Call function with inquirer prompt that lists all employees for you to choose from, then change their role (give them choices to pick from)
                break;
            case UPDATE_EMPL_MNGR:
                // Call function with inquirer prompt that lists all employees for you to choose from, then change their manager (give them choices to pick from)
                break;
            default:
                console.log('Try again');
                process.exit(1);
        }

    })
};

start();