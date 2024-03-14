const mysql = require('mysql2'); // Import and require mysql2
const inquirer = require('inquirer'); // get inquirer access
const cTable = require('console.table'); // used to display data tables nicer

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employee_db',
    },
    console.log(`Connected to the employee_db database.`)
);

const updateEmployee = async () => { // update an employee

    // Get all employees for prompt
    const sql = 'SELECT * FROM employee';
    db.query(sql, (err, employeeResult) => {

        if(err) throw err;

        // Get all the roles for prompt
        const sql2 = 'SELECT * FROM role';

        db.query(sql2, (err, roleResult) => {

            if(err) throw err;

            inquirer.prompt([
                
                {
                    type: "list",
                    name: "employee",
                    message: "Which employee's role would you like to update?",
                    choices: () =>
                    employeeResult.map((employeeResult) => employeeResult.first_name + ' ' + employeeResult.last_name),
                },
                {
                    type: "list",
                    name: "role",
                    message: "Which role would you like to assign to the selected employee?",
                    choices: () =>
                    roleResult.map((roleResult) => roleResult.title),
                },
            ])
            .then((updateMe) => {

                let roleID = 0;
                //Find that role id
                for(i = 0; i < roleResult.length; i++){
                    if(roleResult[i].title == updateMe.role){
                        roleID = roleResult[i].id;
                    }
                }

                let employeeID = 0;
                //Find that employee id
                for(i = 0; i < employeeResult.length; i++){

                    let fullName = employeeResult[i].first_name + ' ' + employeeResult[i].last_name; // get full name

                    if(fullName == updateMe.employee){ // compare full names to get id
                        employeeID = employeeResult[i].id;
                    }
                }

                // Now update the role considering we have the information we need

                const sql3 = 'UPDATE employee SET role_id = ? WHERE id = ?';

                db.query(sql3, [roleID, employeeID], (err, result) => {
                    if(err) throw err;

                    console.log('\n' + updateMe.employee + " has been updated to the role of " + updateMe.role + ".\n");

                    startPrompt(); // start prompt again
                });
            });
        });
    });

}

const addEmployee = async () => { // add employee

    // Get query for list of roles
    const sql = 'SELECT * FROM role';

    db.query(sql, (err, roleResult) => {
        if(err) throw err;

        // Get query for list of managers
        const sql2 = 'SELECT * FROM employee WHERE manager_id IS NOT NULL';

        db.query(sql2, (err, managerResult) => {
            if(err) throw err;

            inquirer.prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "What is the first name of the new employee?"
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the last name of the new employee?"
                },
                {
                    type: "list",
                    name: "role",
                    message: "What is the role of this employee?",
                    choices: () =>
                    roleResult.map((roleResult) => roleResult.title),
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Who is this employee's manager?",
                    choices: () =>
                    managerResult.map((managerResult) => managerResult.first_name + ' ' + managerResult.last_name),
                }
            ])
            .then((newEmployee) => {

                let roleID = 0;
                //Find that role id
                for(i = 0; i < roleResult.length; i++){
                    if(roleResult[i].title == newEmployee.role){
                        roleID = roleResult[i].id;
                    }
                }
    
                let managerID = 0;

                //Find that manager id
                for(i = 0; i < managerResult.length; i++){

                    let managerFullName = managerResult[i].first_name + ' ' + managerResult[i].last_name; // get full name
                    
                    if(managerFullName == newEmployee.manager){
                        managerID = managerResult[i].id;
                    }
                }

                const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';

                db.query(sql, [newEmployee.firstName, newEmployee.lastName, roleID, managerID],  (err, result) => { // add to employees
                    if(err) throw err;
                    console.log('\n' + newEmployee.firstName + ' ' + newEmployee.lastName + ' has been be added to the database.\n');
                    startPrompt(); // start prompt again
                });
            }); 
        });
    });
}


const addRole = async () => { // add a role

    // Get an array of departments
    const sql = 'SELECT * FROM department'; // create query statement

    db.query(sql, (err, result) => {
        if(err) throw err;

        inquirer.prompt([ // ask questions
        {
          type: "input",
          name: "title",
          message: "What new Role would you like to create?"
       },
       {
        type: "input",
        name: "salary",
        message: "What is the Salary of this Role?"
        },
        {
            type: "list",
            name: "department",
            message: "What is the Department of this Role?",
            choices: () =>
                result.map((result) => result.department_name),
        }
        ])
        .then((newRole) => {
            console.log("\n" + newRole.title + " will be added.\n");


            //console.log(result);
           // console.log("ADD TO THIS: " + newRole.department);

            let deptID = 0;
            //Find that department id
            for(i = 0; i < result.length; i++){
                if(result[i].department_name == newRole.department){
                    deptID = result[i].id;
                }
            }

           // create sql statement

            const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?,?,?)';

            db.query(sql, [newRole.title, newRole.salary, deptID],  (err, result) => { // add to roles
                if(err) throw err;
                console.log(newRole.title + ' was been added to database.\n');
                startPrompt(); // start prompt again
            });
        });
    });
}

const addDepartment = async () => { // add a department
    const newDepartment = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Please list new department to add."
       },
     ]);

    const sql = 'INSERT INTO department (department_name) VALUES (?)';

    db.query(sql, newDepartment.name, (err, result) => {
        if(err) throw err;
        console.log('\n' + newDepartment.name + ' was added to database.\n');
        startPrompt(); // start prompt again
    });
}

function viewEmployees(){
    const sql = 
    `SELECT employee.id,
        CONCAT(employee.first_name, ' ',employee.last_name) AS Name,
        role.title AS Title,
        department.department_name AS Department,
        role.salary AS Salary,
        CONCAT(Manager.first_name,' ',Manager.last_name) AS Manager
    FROM employee 
    INNER JOIN role ON employee.role_id=role.id
    INNER JOIN department ON role.department_id=department.id
    LEFT JOIN employee Manager ON Manager.id = employee.manager_id`; // create query statement
    

    db.query(sql, (err, result) => { // applay query
        if(err) throw err;
        console.log("\n     EMPLOYEES     \n");
        console.table(result); // display results
        startPrompt(); // start prompt again
    });

}

function viewRoles(){
    const sql = 'SELECT role.id,role.title AS Title,role.salary AS Salary,department.department_name AS Department FROM role INNER JOIN department ON role.department_id=department.id'; // create query statement

    db.query(sql, (err, result) => { // applay query
        if(err) throw err;
        console.log("\n     ROLES     \n");
        console.table(result); // display results
        startPrompt(); // start prompt again
    });

}

function viewDepartments(){
    const sql = 'SELECT id,department_name AS Department FROM department'; // create query statement

    db.query(sql, (err, result) => { // applay query
        if(err) throw err;
        console.log("\n     DEPARTMENTS     \n");
        console.table(result); // display results
        startPrompt(); // start prompt again
    });
}

const askForInput = () => { // See what user wants to view or change
    return inquirer.prompt ([
        {
            type: 'list', 
            name: 'choice',
            message: 'What  would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee','Update an employee role', 'Exit']
        }
    ]);
}

function startPrompt() { // Initialize the app
    askForInput() // Start prompt
        .then((input) => { // then get input
            
            // Determine what user wants to do
            switch(input.choice){ // Based upon choice, the code will do something
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployee();
                    break;
                case 'Exit':
                    console.log("\nBye for now.\n");
                    db.end(); // close connection to database
                    break;
                default:
                    console.log("Something went wrong...");
            }
        });
}

console.log("\n**************   EMPLOYEE MANAGER   **************\n")
// Function call to initialize app
startPrompt();