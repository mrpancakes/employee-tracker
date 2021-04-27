const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const VIEW_ALL_EMPL = "View ALL Employees";
const EMPL_BY_DEPT = "View All Employees By Department";
const EMPL_BY_MNGR = "View All Employees By Manager";
const ADD_EMPL = "Add New Employee";
const REMOVE_EMPL = "Remove Employee";
const UPDATE_EMPL_ROLE = "Update Employee Role";
const UPDATE_EMPL_MNGR = "Update Employee Manager";
const EXIT = "Exit";

let managersArr = [];
let departmentsArr = [];
let rolesArr = [];
let roleIdArr = [];
let employeesArr = [];

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
    updateRolesArr();
    updateEmplArr();

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
                // call function that displays all employees and then starts the start() function over again.
                break;
            case EMPL_BY_DEPT:
                emplByDept();
                break;
            case EMPL_BY_MNGR:
                emplByMngr();
                break;
            case ADD_EMPL:
                addEmpl();
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
    connection.query('SELECT first_name, last_name, title, salary, department_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN departments ON role.department_id = departments.id', (err, res) => {
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
            name: 'mngrName',
            type: 'list',
            message: 'Select a department to view their employees',
            choices: managersArr
        }
    ]).then(answer => {
        const { mngrName } = answer;
        connection.query(`SELECT e.id AS 'EmpId' , e.first_name , e.last_name ,
        m.id AS manager_id, concat(m.first_name, ' ', m.last_name) AS mananger_fullname
        FROM employee e
        JOIN employee m
        ON (e.manager_id = m.id)
        WHERE concat(m.first_name, ' ', m.last_name) = '${mngrName}'`,
            (err, res) => {
                if (err) throw err;
                const table = cTable.getTable(res);
                console.log(table);
                start();
            });
    });
};

const addEmpl = () => {
    connection.query('SELECT id as role_id, title, salary FROM role', (err, res) => {
        const role = res.map(({ role_id, title, salary}) =>({
            value: role_id,
            title: `${title}`,
            salary: `${salary}`
        }));

        console.table(res);
        employeeRoles(role);
    });
};

const employeeRoles = (role) => {
    inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "New Employee First Name: "
    },
    {
      type: "input",
      name: "lastName",
      message: "New Employee Last Name: "
    },
    {
      type: "list",
      name: "roleId",
      message: "Select Role ID (refer to table above): ",
      choices: role
    }
  ]).then(answer => { 
      connection.query('INSERT INTO employee SET ?',{
        first_name: answer.firstName,
        last_name: answer.lastName,
        role_id: answer.roleId
      },(err, res)=>{
        if(err) throw err;
        console.log(res);
        start();
    });
  });
};



const updateDeptArr = () => {
    departmentsArr = [];
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        res.forEach(department => {
            departmentsArr.push(department.department_name)
        });
    });

};

const updateMngrArr = () => {
    managersArr = [];
    connection.query(`SELECT e.id AS 'EmpId' , e.first_name , e.last_name ,
    m.id AS manager_id, concat(m.first_name, ' ', m.last_name) AS mananger_fullname
    FROM employee e
    JOIN employee m
    ON (e.manager_id = m.id)`, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            managersArr.push(res[i].mananger_fullname);
        }
    });
};

const updateRolesArr = () => {
    rolesArr = [];
    connection.query('SELECT title FROM role', (err, res) => {
        if (err) throw err;
        res.forEach(role => {
            rolesArr.push(role.title);
        });
    });
};

const updateEmplArr = () => {
    employeesArr = [];
    employeesArr.push('None');
    connection.query(`SELECT concat(first_name, ' ', last_name) AS full_name FROM company_orgDB.employee`, (err, res) => {
        if (err) throw err;
        res.forEach(empl => {
            employeesArr.push(empl.full_name);
        });
    });
}


start();

