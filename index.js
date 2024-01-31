const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'employee_db',
});

// Handle database connection errors
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1); // Terminate the application on connection error
  } else {
    console.log('Connected to the employee_db database.');
    startPrompt(); // Start the application prompt after successful connection
  }
});

// Function to add a new employee
const addEmployee = async () => {
  try {
    const newEmployee = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the new employee:',
      },
    ]);
    console.log(`${newEmployee.name} will be added`);
    startPrompt();
  } catch (error) {
    console.error('Error adding employee:', error);
    startPrompt(); // Restart prompt after error
  }
};

// Function to find department ID
const findDepartmentId = async (department) => {
  try {
    const sql = 'SELECT id FROM department WHERE department_name = ?';
    const [rows, fields] = await db.promise().execute(sql, [department]);
    if (rows.length > 0) {
      return rows[0].id;
    }
    return null; // Return null if department not found
  } catch (error) {
    console.error('Error finding department ID:', error);
    return null; // Return null on error
  }
};

// Function to insert role into the database
const insertRoleIntoDatabase = async (departmentList) => {
  try {
    const newRole = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the new role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the new role:',
      },
      {
        type: 'list',
        name: 'department',
        message: 'Select the department for the new role:',
        choices: departmentList,
      },
    ]);
    const deptId = await findDepartmentId(newRole.department);
    if (deptId) {
      console.log(`${newRole.title} role will be added to department ${newRole.department}`);
    } else {
      console.log('Department not found.');
    }
    startPrompt();
  } catch (error) {
    console.error('Error inserting role into database:', error);
    startPrompt(); // Restart prompt after error
  }
};

// Function to add a new role
const addRole = async () => {
  try {
    const sql = 'SELECT department_name FROM department';
    const [rows, fields] = await db.promise().execute(sql);
    const departmentList = rows.map((row) => row.department_name);
    await insertRoleIntoDatabase(departmentList);
  } catch (error) {
    console.error('Error adding role:', error);
    startPrompt(); // Restart prompt after error
  }
};

// Function to add a new department
const addDepartment = async () => {
  try {
    const newDepartment = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the new department:',
      },
    ]);
    const sql = 'INSERT INTO department (department_name) VALUES (?)';
    await db.promise().execute(sql, [newDepartment.name]);
    console.log(`${newDepartment.name} has been added to the database.`);
    startPrompt();
  } catch (error) {
    console.error('Error adding department:', error);
    startPrompt(); // Restart prompt after error
  }
};

// Function to view all employees
function viewEmployees() {
  try {
    const sql = `SELECT employee.id,
      CONCAT(employee.first_name, ' ', employee.last_name) AS Name,
      role.title AS Title,
      department.department_name AS Department,
      role.salary AS Salary,
      CONCAT(Manager.first_name, ' ', Manager.last_name) AS Manager
    FROM employee 
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee Manager ON Manager.id = employee.manager_id`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error viewing employees:', err);
      } else {
        console.table(result);
        startPrompt();
      }
    });
  } catch (error) {
    console.error('Error viewing employees:', error);
    startPrompt(); // Restart prompt after error
  }
}

// Function to view all roles
function viewRoles() {
  try {
    const sql = `SELECT role.id, role.title AS Title, role.salary AS Salary,
      department.department_name AS Department FROM role
      INNER JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error viewing roles:', err);
      } else {
        console.table(result);
        startPrompt();
      }
    });
  } catch (error) {
    console.error('Error viewing roles:', error);
    startPrompt(); // Restart prompt after error
  }
}

// Function to view all departments
function viewDepartments() {
  try {
    const sql = 'SELECT id, department_name AS Department FROM department';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error viewing departments:', err);
      } else {
        console.table(result);
        startPrompt();
      }
    });
  } catch (error) {
    console.error('Error viewing departments:', error);
    startPrompt(); // Restart prompt after error
  }
}

// Function to handle user input
const askForInput = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit'],
    },
  ]);
};

// Function to end the program
function endProgram() {
  db.end((err) => {
    if (err) {
      console.error('Error ending database connection:', err);
    }
    console.log('Connection to database closed.');
  });
}

// Function to start the application prompt
function startPrompt() {
  askForInput()
    .then((input) => {
      switch (input.choice) {
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
          // Implement update employee role functionality
          break;
        case 'Exit':
          console.log('Exiting application. Goodbye!');
          endProgram();
          break;
        default:
          console.log('Invalid choice. Please try again.');
          startPrompt();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Initialize the application
startPrompt();
