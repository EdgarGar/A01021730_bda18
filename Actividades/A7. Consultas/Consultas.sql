explain
show index from orderdetails
drop index ordernumberidx on orderdetails

--describe orderdetails
explain
select *
from orderdetails
where quantityOrder 

--Consultas
SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
FROM Orders
INNER JOIN Customers
ON Orders.CustomerID=Customers.CustomerID;
