delimiter $$

create procedure cheap(
)
BEGIN

	select MAX(buyPrice), MIN(buyPrice) from products;
END$$

delimiter ;
