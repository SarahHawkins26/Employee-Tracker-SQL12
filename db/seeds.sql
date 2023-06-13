INSERT INTO department (dep_name)
VALUES  ('Management'),
        ('Sales'),
        ('Human Resource'),
        ('Finance'),
        ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES  ('General Manager', 100000, 1),
        ('Assistant Manager', 80000, 1),
        ('Sales Lead', 90000, 2),
        ('Sales Rep', 70000, 2),
        ('Lead HR Specialist', 75000, 3),
        ('HR Specialist', 60000, 3),
        ('Chief Financial Officer', 90000, 4),
        ('Budget Analyst', 70000, 4),
        ('Legal Team Lead', 180000, 5),
        ('Lawyer', 150000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Kamado', 'Tanjiro', 1, null),
        ('Kamado', 'Nezuko', 2, 1),
        ('Agatsuma', 'Zenitsu', 4, 1),
        ('Hashibira', 'Inosuke', 3, 1),
        ('Tsuyuri', 'Kanao', 6, 5),
        ('Shinazugawa', 'Genya', 5, 10),
        ('Tomioka', 'Giyu', 8, null),
        ('Kyojuro', 'Rengoku', 7, null),
        ('Uzui', 'Tengen', 9, null),
        ('Kanroji', 'Mitsuri', 10, null);

