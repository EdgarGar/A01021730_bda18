--Primera parate de creacion de tabla
CREATE TABLE LOG_FILM(
  idPelicula int NOT NULL,
  tipo VARCHAR(15) NOT NULL,
  film_id int NOT NULL,
  last_value TEXT,
  new_value TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIME,
  PRIMARY KEY(id)
);

--Procedur de la tabla
create procedure UPDATE_LOG(
	IN id INT,
  new_value TEXT,
  timestamp DATETIME
)
BEGIN
	INSERT INTO LOG_FILM(id, new_value, timestamp)
  VALUES (id, new_value);
END;

-- Triger para cada update en la tabal film
CREATE TRIGGER UPDATE_TRIGGER
   AFTER UPDATE ON LOG_FILM
   FOR EACH ROW
   CALL UPDATE_LOG(NEW.idPelicula, NEW.languageid) 

CREATE procedure LOG_FILM_CURSOR()

--
BEGIN
  declare ids int;
  declare done int default false;
  declare cursor1 cursor for select id from LOG_FILM;
  declare continue handler for not found set done = true;

  open cursor1;
  read_loop: loop
	fetch cursor1 into ids;
	IF done THEN
      	LEAVE read_loop;
	END IF;
  	UPDATE film SET title = CONCAT(getCategory(ids), '_', title)
	WHERE film_id = ids;
  end loop;
	select ids;
  close cursor1;
end


----Parte de DB2------
--Creación de la tabla gomitas
DROP TABLE GOMITAS;
CREATE TABLE GOMITAS (
    ID INT NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    NOMBRE VARCHAR(50) NOT NULL,
    PRECIO INT NOT NULL,
    CSTART DATE NOT NULL,
    CEND DATE NOT NULL,
    period BUSINESS_TIME(CSTART, CEND),
    PRIMARY KEY (ID business_time WITHOUT overlaps)
);

--Registro de gomitas
INSERT INTO gomitas (NOMBRE, PRECIO, CSTART, CEND) VALUES
  ('gomita1', 5, '2018-1-1', '2019-1-1'),
  ('gomita2', 10, '2018-1-1', '2019-1-1'),
  ('gomita3', 15, '2018-1-1', '2019-1-1'),
  ('gomita4', 20, '2018-1-1', '2019-1-1'),
  ('gomita5', 25, '2018-1-1', '2019-1-1'),
  ('gomita6', 30, '2018-1-1', '2019-1-1'),
  ('gomita7', 35, '2018-1-1', '2019-1-1'),
  ('gomita8', 40, '2018-1-1', '2019-1-1'),
  ('gomita9', 45, '2018-1-1', '2019-1-1'),
  ('gomita10', 50, '2018-1-1', '2019-1-1'),
  ('gomita11', 55, '2018-1-1', '2019-1-1'),
  ('gomita12', 60, '2018-1-1', '2019-1-1');

--Variacion de precios
UPDATE GOMITAS
FOR PORTION OF BUSINESS_TIME FROM '2018-2-1' to '2019-1-1'
  SET PRECIO = PRECIO*1.45;

UPDATE GOMITAS
FOR PORTION OF BUSINESS_TIME FROM '2018-2-15' to '2019-1-1'
  SET PRECIO = (PRECIO/1.45)*1.1;

UPDATE GOMITAS
FOR PORTION OF BUSINESS_TIME FROM '2018-4-25' to '2019-1-1'
  SET PRECIO = PRECIO*1.45;

UPDATE GOMITAS
FOR PORTION OF BUSINESS_TIME FROM '2018-5-5' to '2019-1-1'
  SET PRECIO = (PRECIO/1.45)*1.1;

UPDATE GOMITAS
FOR PORTION OF BUSINESS_TIME FROM '2018-10-25' to '2019-1-1'
  SET PRECIO = PRECIO*1.45;

UPDATE GOMITAS
FOR PORTION OF BUSINESS_TIME FROM '2018-11-5' to '2019-1-1'
SET PRECIO = (PRECIO/1.45)*1.1;



--Consultas 
SELECT * FROM GOMITAS WHERE NOMBRE='gomita1';

SELECT SUM(PRECIO)/COUNT(*) AS AVG FROM GOMITAS WHERE NOMBRE='gomita1';

SELECT MAX(PRECIO) AS MAX FROM GOMITAS WHERE NOMBRE='gomita1';

SELECT MIN(PRECIO) AS MAX FROM GOMITAS WHERE NOMBRE='gomita1';

