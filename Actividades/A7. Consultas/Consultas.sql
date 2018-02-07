explain
show index from orderdetails
drop index ordernumberidx on orderdetails

--describe orderdetails
explain
select *
from orderdetails
where quantityOrder 


--Create index
CREATE index quantityOrder