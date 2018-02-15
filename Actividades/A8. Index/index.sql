EXPLAIN format=json
SELECT *
FROM orderdetails force index(index_4)
WHERE orderLineNumber = 1 and quantityOrdered > 50;
--1: 95.20
--2: 93.41
--3: 8.01
--4: 8.01

EXPLAIN format=json
SELECT productCode
FROM orderdetails force index(index_4)
WHERE orderLineNumber = 1 and quantityOrdered > 50;
--1: 95.20
--2: 27.62
--3: 3.02
--4: 3.02

EXPLAIN format=json
SELECT orderLineNumber, count(*)
FROM orderdetails force index(index_4)
WHERE orderLineNumber = 1 and quantityOrdered > 50;
--1: 95.20
--2: 27.62
--3: 3.02
--4: 3.02
