delimiter $$

create procedure show_products(
IN linea_producto varchar(50))
BEGIN
	declare line varchar(50);

	set line = CONCAT(linea_producto, "%");
	select * from products
	where productLine like line;

END$$

delimiter ;
