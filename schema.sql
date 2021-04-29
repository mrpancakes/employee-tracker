DROP DATABASE IF EXISTS company_orgDB;
CREATE DATABASE company_orgDB;
USE company_orgDB;

CREATE TABLE departments(
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT NOT NULL, -- will reference the department this role falls under
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL, -- will reference the role this employee has
  manager_id INT NULL, -- will reference another employee's id that is deemed their manager
  PRIMARY KEY (id)
);

INSERT INTO departments (department_name) 
VALUES ('IT'), ('HR'), ('Sales'), ('Marketing');

SELECT * FROM departments;


INSERT INTO role (title, salary, department_id)
VALUES ('Senior Digital Marketer', '90000', 4), ('Junior Digital Marketer', '70000', 4), ('HR Manager', '90000', 2), ('HR Associate', '65000', 2), ('IT Manager', '150000', 1), ('IT Associate', '80000', 1), ('Sales Manager', '100000', 3), ('Sales Associate', '75000', 3) ;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ricky', 'Martin', 1, NULL), 
('Sam', 'Sheen', 2, 1), -- Ricky is Sam's Manager
('Darla', 'Smith', 3, NULL),
('Josh', 'Banning', 4, 3) -- Darla is Josh's Manager
;

SELECT * FROM employee;

