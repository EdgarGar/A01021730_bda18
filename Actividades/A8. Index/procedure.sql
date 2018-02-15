CREATE PROCEDURE deemo_cursor()
BEGIN
    DECLARE ids int;
    DECLARE done int DEFAULT FALSE;
    DECLARE cursor1 CURSOR FOR SELECT actor_id FROM actor;
    DECLARE CONTINUE HANDLER
        FOR NOT FOUND
        SET done = TRUE;

    OPEN cursor1;
    read_loop: loop
        FETCH cursor1 INTO ids;
        IF done THEN
            LEAVE read_loop;
        END IF;
        --set ids = id_actor;
    END LOOP;
        SELECT ids;
    CLOSE cursor1;
END