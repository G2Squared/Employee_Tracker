/* Create the database if it doesn't exist */
CREATE DATABASE IF NOT EXISTS employee_db;

/* Use the database */
USE employee_db;

/* Create the tables */

/* Department table */
CREATE TABLE IF NOT EXISTS department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(50) NOT NULL
);

/* Role table */
CREATE TABLE IF NOT EXISTS role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL,
  INDEX (department_id) /* Index added for faster retrieval */
);

/* Employee table */
CREATE TABLE IF NOT EXISTS employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL, /* Manager's ID referencing employee's ID */
  INDEX (role_id), /* Index added for faster retrieval */
  INDEX (manager_id) /* Index added for faster retrieval */
);