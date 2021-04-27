const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const VIEW_ALL_EMPL = "View ALL Employees";
const EMPL_BY_DEPT = "View All Employees By Department";
const EMPL_BY_MNGR = "View All Employees By Manager";
const ADD_EMPL = "Add Employee";
const REMOVE_EMPL = "Remove Employee";
const UPDATE_EMPL_ROLE = "Update Employee Role";
const UPDATE_EMPL_MNGR = "Update Employee Manager";
const EXIT = "Exit";

let managersArr = [];
let departmentsArr = [];

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
    updateDeptArr();
    updateMngrArr();
    inquirer.prompt([
        {
            name: 'queryOption',
            type: 'list',
            message: 'Choose an option!',
            choices: [VIEW_ALL_EMPL, EMPL_BY_DEPT, EMPL_BY_MNGR, ADD_EMPL, REMOVE_EMPL, UPDATE_EMPL_ROLE, UPDATE_EMPL_MNGR, EXIT]
        }
    ]).then(answers => {

        const { queryOption } = answers;

        switch (queryOption) {
            case VIEW_ALL_EMPL:
                viewAllEmpl();
                // call function that displays all employees and then starts the start() function again.
                break;
            case EMPL_BY_DEPT:
                emplByDept();
                break;
            case EMPL_BY_MNGR:
                // Call function with inquirer prompt that lists all managers for you to choose from, .then(answers) will then have it's own switch statement and will display employees based on the manager the user chose.
                // How can the answer choices pull the Managers from the table and list them as the answer choices?

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
            case EXIT:
                console.log('Bye!');
                process.exit(1);
            default:
                console.log('Please select an option');
                process.exit(1);
        }

    })
};

const viewAllEmpl = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table); // Later, need to join table rows for title, department, salary, and manager name
        start();
    })
}

const emplByDept = () => {

    inquirer.prompt([
        {
            name: 'deptName',
            type: 'list',
            message: 'Select a department to view their employees',
            choices: departmentsArr
        }
    ]).then(answers => {
        const { deptName } = answers;
        connection.query(`
        SELECT first_name, last_name, title, salary, department_name 
        FROM employee 
        INNER JOIN role ON employee.role_id = role.id 
        INNER JOIN departments ON role.department_id = departments.id 
        WHERE ?`,
            {
                department_name: deptName
            },
            (err, res) => {
                if (err) throw err;
                const table = cTable.getTable(res);
                console.log(table);
                start();
            });
    });
};

const emplByMngr = () => {

    inquirer.prompt([
        {
            name: 'deptName',
            type: 'list',
            message: 'Select a department to view their employees',
            choices: departmentsArr
        }
    ]).then(answers => {
        const { deptName } = answers;
        connection.query(`
        SELECT first_name, last_name, title, salary, department_name 
        FROM employee 
        INNER JOIN role ON employee.role_id = role.id 
        INNER JOIN departments ON role.department_id = departments.id 
        WHERE ?`,
            {
                department_name: deptName
            },
            (err, res) => {
                if (err) throw err;
                const table = cTable.getTable(res);
                console.log(table);
                start();
            });
    });
};

const updateDeptArr = () => {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        res.forEach(department => {
            departmentsArr.push(department.department_name)
        });
    });
};

const updateMngrArr = () => {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        res.forEach(department => {
            departmentsArr.push(department.department_name)
        });
    });
};

start();
