INSERT INTO department (department_name)
VALUES ("Marketing"),
       ("Human Resources"),
       ("Operations"),
       ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Specialist", 65000, 1),
       ("Marketing Manager", 80000, 1),
       ("HR Specialist", 50000, 2),
       ("HR Manager", 65000, 2),
       ("Operations Coordinator", 52000, 3),
       ("Operations Manager", 70000, 3),
       ("Software Engineer", 75000, 4),
       ("Lead Software Engineer", 95000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("George", "Finney", 1, 3),
       ("Billy", "Joe", 2, 3),
       ("Michael", "Jackson", 3, NULL),
       ("Luna", "Keys", 4, 5),
       ("Noel", "Haney", 5, NULL),
       ("Perry", "Jones", 6, 7),
       ("Sherry", "Shields", 7, NULL),
       ("Katy", "Fernandez", 8, 10),
       ("Abigal", "Fitz", 9, 10),
       ("Theo", "Brown", 10, NULL);