/* Create the database */
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

/* Use the database */
USE employee_db;

/* Create the tables */

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL /* Create a foreign key that links roles table to department table */
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL, /* Create a foreign key that links employee table to role table */
  manager_id INT
);
