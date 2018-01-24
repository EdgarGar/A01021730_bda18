delimiter $$

create procedure customers_with_letter(
	IN letter CHAR
)
BEGIN
	declare contador int default 0;
	select count(*) into contador from customers WHERE customerName LIKE CONCAT(letter, "%");
	select contador;
END$$

delimiter ;
