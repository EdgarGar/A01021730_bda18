DROP FUNCTION get_film_category;
delimiter $$
CREATE FUNCTION get_film_category(film SMALLINT(5)) RETURNS VARCHAR(25)
  BEGIN
    DECLARE cat_name VARCHAR(25);
    SET cat_name = (
      SELECT c.name
      FROM category c INNER JOIN film_category fc
          ON c.category_id = fc.category_id
      WHERE fc.film_id = film
    );
    RETURN cat_name;
  END $$
CREATE PROCEDURE update_names()
  BEGIN
    DECLARE ids int;
    DECLARE done int DEFAULT FALSE;
    DECLARE cursor1 CURSOR FOR SELECT film_id FROM film;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = true;

    OPEN cursor1;
    read_loop: LOOP
      FETCH cursor1 INTO ids;
      IF done THEN
        LEAVE read_loop;
      END IF;
      UPDATE film set title=CONCAT(get_film_category(ids),'_', title) WHERE film_id=ids;
    END LOOP;
    CLOSE cursor1;
  END $$
DELIMITER ;
CALL update_names();
