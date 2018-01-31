--Creacion de la tabla
create table course 
    (course_number int not null,  
    title varchar(20) not null,
    credits smallint not null with default 3,
    price decimal(6, 2) not null,
    cstart date not null,
    cend date not null,
    period business_time(cstart, cend),
    PRIMARY key(course_number, 
    business_time WITHOUT overlaps))

--Cursos agregados
INSERT INTO course(course_number, title, credits, price, cstart, cend) VALUES (1,'BD', 5, 300, '2017-01-01', '2017-06-01')
INSERT INTO course(course_number, title, credits, price, cstart, cend) VALUES (2,'BBDA', 8, 800, '2017-06-01', '2017-12-01')
INSERT INTO course(course_number, title, credits, price, cstart, cend) VALUES (3,'C++', 6, 550, '2018-01-01', '2018-06-01')
INSERT INTO course(course_number, title, credits, price, cstart, cend) VALUES (4,'MetaPrograming', 4, 380, '2017-03-01', '2017-06-01')

SELECT * FROM course FOR business_time AS OF '2017-05-01'

SELECT * FROM course FOR business_time FROM '2017-01-01' TO '2017-12-31'

--Funcion para actualizar
UPDATE course FOR portion OF business_time FROM '2018-04-01' TO '2018-05-01' SET price = 200.00 WHERE course_number = 4

--Agregacion de un quiento curso
INSERT INTO course(course_number, title, credits, price, cstart, cend) VALUES (5,'AYMSS', 4, 800, '2017-08-01', '2017-09-01')
INSERT INTO course(course_number, title, credits, price, cstart, cend) VALUES (3,'C++', 6, 200, '2018-02-01', '2018-03-01')
INSERT INTO course(course_number, title, credits, price, cstart, cend) VALUES (6,'AYMSS', 6, 380, '2018-03-01', '2018-06-01')


--DELETE
DELETE FROM class FOR portion OF business_time FROM 'date' to 'date' WHERE course_number = 3

--Sytem time

CREATE TABLE course_sys
(course_number int PRIMARY KEY not null, 
credits varchar(20) not null,
credits SMALLINT not null WITH default 3,
price decimal(7, 2), 
SYS_START TIMESTAMP (12) GENERATED ALWAYS AS ROW BEGIN NOT NULL,
SYS_END TIMESTAMP(12) GENERATED ALWAYS AS ROW END NOT NULL,
TRANS_START  TIMESTAMP(12) GENERATED ALWAYS AS TRANSACTION START ID IMPLICITLY HIDDEN,
PERIOD SYSTEM_TIME(SYS_START, SYS_END))

--
CREATE TABLE course_sys_history LIKE course_sys

--Guardar cambios en la tabla course_sys_history
ALTER TABLE course_sys
ADD versioning
USE history table course_sys_history

--Tablas
INSERT INTO course_sys (course_number, title, credits, price)
VALUES (500, 'intro to sql', 2, 200.00)
INSERT INTO course_sys (course_number, title, credits, price)
VALUES (600, 'intro ruby', 2, 250.00)
INSERT INTO course_sys (course_number, title, credits, price)
VALUES (650, 'advanced ruby', 3, 400.00)

--Borrado del curso 600

DELETE FROM class FOR portion OF business_time FROM 'date' to 'date' WHERE course_number = 600