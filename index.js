const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const VIEW_ALL_EMPL = "View ALL Employees";
const VIEW_ALL_DEPTS = "View All Departments"
const VIEW_ALL_ROLES = "View All Roles"
const EMPL_BY_DEPT = "View All Employees By Department";
const EMPL_BY_MNGR = "View All Employees By Manager";
const ADD_EMPL = "Add New Employee";
const ADD_DEPT = "Add New Department";
const ADD_ROLE = "Add New Role";
const REMOVE_EMPL = "Remove Employee";
const UPDATE_EMPL_ROLE = "Update Employee Role";
const EXIT = "Exit";

let managersArr = [];
let departmentsArr = [];
let rolesArr = [];
let employeesArr = [];

const logo = `╔═════════════════════════════════════════════════════╗
║                                                     ║
║     _____                 _                         ║
║    | ____|_ __ ___  _ __ | | ___  _   _  ___  ___   ║
║    |  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\  ║
║    | |___| | | | | | |_) | | (_) | |_| |  __/  __/  ║
║    |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|  ║
║                    |_|            |___/             ║
║                                                     ║
║     __  __                                          ║
║    |  \\/  | __ _ _ __   __ _  __ _  ___ _ __        ║
║    | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |\/ _ \\ '__|       ║
║    | |  | | (_| | | | | (_| | (_| |  __/ |          ║
║    |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|          ║
║                              |___/                  ║
║                                                     ║
\╚═════════════════════════════════════════════════════╝
`

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
            choices: [VIEW_ALL_EMPL, VIEW_ALL_DEPTS, VIEW_ALL_ROLES, EMPL_BY_DEPT, EMPL_BY_MNGR, ADD_EMPL, ADD_DEPT, ADD_ROLE, REMOVE_EMPL, UPDATE_EMPL_ROLE, EXIT]
        }
    ]).then(answers => {

        const { queryOption } = answers;

        switch (queryOption) {
            case VIEW_ALL_EMPL:
                viewAllEmpl();
                break;
            case VIEW_ALL_DEPTS:
                viewAllDepts();
                break;
            case VIEW_ALL_ROLES:
                viewAllRoles();
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
            case ADD_DEPT:
                addDept();
                break;
            case ADD_ROLE:
                addRole();
                break;
            case REMOVE_EMPL:
                deleteEmpl();
                break;
            case UPDATE_EMPL_ROLE:
                updateRole();
                break;

            case EXIT:
                console.log('---------------------------------------------------');
                console.log(`                   SEE YA LATER!`);
                console.log('---------------------------------------------------');
                process.exit(1);
            default:
                console.log('Please select an option');
                process.exit(1);
        }
    })
};

const viewAllEmpl = () => {
    let query = `SELECT employee.id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title as 'Job Title', departments.department_name AS Department, role.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN departments ON departments.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(' ');
        console.log(` ALL EMPLOYEES:`);
        console.log(' ');
        const table = cTable.getTable(res);
        console.log(table);
        start();
    });
}

const viewAllDepts = () => {
    let query = `SELECT department_name AS Departments FROM Departments`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(' ');
        const table = cTable.getTable(res);
        console.log(table);
        start();
    });
};

const viewAllRoles = () => {
    let query = `SELECT title AS 'Job Title', salary AS 'Salary', department_name AS 'Department' FROM role INNER JOIN departments ON department_id = departments.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(' ');
        console.log(` ALL JOB ROLES:`);
        console.log(' ');
        const table = cTable.getTable(res);
        console.log(table);
        start();
    });
};

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
        SELECT employee.id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title as 'Job Title', departments.department_name AS Department, role.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN departments ON departments.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id 
        WHERE ?`,
            {
                department_name: deptName
            },
            (err, res) => {
                if (err) throw err;
                const upperCaseDept = deptName.toUpperCase();
                console.log(' ');
                console.log(` ALL ${upperCaseDept} EMPLOYEES:`);
                console.log(' ');
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
        connection.query(`SELECT employee.id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title as 'Job Title', departments.department_name AS Department, role.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN departments ON departments.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id
        WHERE CONCAT(manager.first_name, ' ', manager.last_name) = '${mngrName}'`,
            (err, res) => {
                if (err) throw err;
                const upperCaseMngr = mngrName.toUpperCase();
                console.log(' ');
                console.log(` ALL EMPLOYEES MANAGED BY ${upperCaseMngr}:`);
                console.log(' ');
                const table = cTable.getTable(res);
                console.log(table);
                start();
            });
    });
};

// ADDING NEW EMPLOYEE

const addEmpl = (role) => {
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
            name: "roleName",
            message: "Select Their Role",
            choices: rolesArr
        },
        {
            type: "list",
            name: "managerName",
            message: "Select their Manager",
            choices: employeesArr
        }
    ]).then(answer => {

        const roleNameArr = answer.roleName.split(" ");
        let roleId = roleNameArr[0];

        const managerNameArr = answer.managerName.split(" ");
        let managerId = managerNameArr[0];

        if (managerId === 'None'){
            managerId = null;
        }

        connection.query('INSERT INTO employee SET ?', {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: roleId,
            manager_id: managerId
        }, (err, res) => {
            if (err) throw err;
            console.log('---------------------------------------------------');
            console.log(`   ${answer.firstName} has been added to the database!`);
            console.log('---------------------------------------------------');
            start();
        });
    });
};

// ADDING A NEW DEPARTMENT

const addDept = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "department_name",
            message: "What's the name of the new department?"
        },

    ]).then(answer => {
        const { department_name } = answer
        connection.query('INSERT INTO departments SET ?',
            { department_name },
            (err, res) => {
                if (err) throw err;
                console.log('---------------------------------------------------');
                console.log(`   A new department has been added: ${department_name}`);
                console.log('---------------------------------------------------');
                start();
            });
    });
};

// ADDING A NEW ROLE

const addRole = () => {
    connection.query(`SELECT id as Dept_ID, department_name FROM departments`, (err, res) => {
        const dept = res.map(({ Dept_ID, department_name }) => ({
            value: Dept_ID,
            department_name,
        }));

        console.table(res);
        deptNameForNewRole(dept);
    });
};


const deptNameForNewRole = (dept) => {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Role Name: "
        },
        {
            type: "number",
            name: "salary",
            message: "Input Salary, no commas or spaces:"
        },
        {
            type: "list",
            name: "department_id",
            message: "What's the Department ID for this role? Refer to the table above.",
            choices: dept
        },

    ]).then(answer => {

        connection.query('INSERT INTO role SET ?',
            {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department_id
            },
            (err, res) => {
                if (err) throw err;
                console.log('---------------------------------------------------');
                console.log(`   A new role has been added: ${answer.title}`);
                console.log('---------------------------------------------------');
                start();
            });
    });
};

// UPDATING AN EMPLOYEE'S ROLE

const updateRole = () => {

    inquirer.prompt([
        {
            name: 'employeeName',
            type: 'list',
            message: 'Whose role do you want to update?',
            choices: employeesArr
        },
        {
            name: 'roleName',
            type: 'list',
            message: 'What is their new role?',
            choices: rolesArr
        },
    ]).then(answers => {

        const roleAnswerArr = answers.roleName.split(" ");
        const roleId = roleAnswerArr[0];

        console.log(roleId);


        if (answers.employeeName === 'None') {
            console.log('------------------------------------');
            console.log("You chose 'None', please select a valid employee name.");
            console.log('------------------------------------');
            start();
        } else {

            const nameArr = answers.employeeName.split(" ");
            let firstName = nameArr[1];
            let lastName = nameArr[2];

            console.log(firstName, lastName);


            connection.query(`UPDATE employee set ? WHERE ? AND ?`,
                [
                    { role_id: roleId },
                    { first_name: firstName },
                    { last_name: lastName }
                    
                ],
                (err, res) => {
                    if (err) throw err;
                    console.log('---------------------------------------------------');
                    console.log(`   ${firstName}'s role has been updated!`);
                    console.log('---------------------------------------------------');
                    start();
                });
        };
    });
};

// DELETING AN EMPLOYEE

const deleteEmpl = () => {

    inquirer.prompt([
        {
            name: 'employeeName',
            type: 'list',
            message: 'Who do you want to delete from the database?',
            choices: employeesArr
        },
    ]).then(answers => {
        const nameArr = answers.employeeName.split(" ");
        let firstName = nameArr[1];
        let lastName = nameArr[2];
        if (answers.employeeName === 'None') {
            console.log('You aborted, no one will be deleted.');
            console.log('------------------------------------');
            start();
        } else {
            connection.query(`DELETE FROM employee WHERE ? AND ?`,
                [
                    { first_name: firstName },
                    { last_name: lastName }
                ],
                (err, res) => {
                    if (err) throw err;
                    console.log('---------------------------------------------------');
                    console.log(`   ${firstName} ${lastName} has been removed from the database.`);
                    console.log('---------------------------------------------------');
                    start();
                });
        }
    });
}

// ADDING VALUES TO ARRAYS TO USE FOR QUESTION ANSWER CHOICES

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
    connection.query(`SELECT concat(id, ' ', title) AS title FROM role`, (err, res) => {
        if (err) throw err;
        res.forEach(role => {
            rolesArr.push(role.title);
        });
    });
};

const updateEmplArr = () => {
    employeesArr = [];
    employeesArr.push('None');
    connection.query(`SELECT concat(id, ' ', first_name, ' ', last_name) AS full_name FROM company_orgDB.employee`, (err, res) => {
        if (err) throw err;
        res.forEach(empl => {
            employeesArr.push(empl.full_name);
        });
    });
}

const openingLogo = () => {
    console.log(logo);
};

openingLogo();
start();

