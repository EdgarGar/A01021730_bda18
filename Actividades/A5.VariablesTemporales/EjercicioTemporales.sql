
CREATE TABLE USERS (
    ID INT NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    NAME VARCHAR(150) NOT NULL,
    ADDRESS VARCHAR(150) NOT NULL,
    SYS_START TIMESTAMP(12) GENERATED ALWAYS AS ROW BEGIN NOT NULL,
    SYS_END TIMESTAMP(12) GENERATED ALWAYS AS ROW END NOT NULL,
    TRANS_START TIMESTAMP(12) GENERATED ALWAYS AS TRANSACTION START ID IMPLICITLY HIDDEN,
    PERIOD SYSTEM_TIME(SYS_START, SYS_END),
    PRIMARY KEY (ID)
);

CREATE TABLE USERS_HYSTORY LIKE USERS;
ALTER TABLE USERS ADD VERSIONING USE HISTORY TABLE USERS_HYSTORY;

CREATE TABLE CARS(
    PLATE VARCHAR(10) NOT NULL,
    YEAR INT NOT NULL,
    MODEL VARCHAR(30) NOT NULL,
    BRAND VARCHAR(30) NOT NULL,
    PRICE DECIMAL NOT NULL,
    INVOICE INT NOT NULL,
    MOTOR_NUM INT NOT NULL,
    SERIES_NUM INT NOT NULL,
    PRIMARY KEY (PLATE)
);

CREATE TABLE INSURANCE (
  CAR_PLATE VARCHAR(10) NOT NULL,
  PRICE DECIMAL(6,2) NOT NULL,
  COVERAGE VARCHAR(50) NOT NULL,
  cstart DATE NOT NULL,
  cend DATE NOT NULL,
  period business_time(cstart, cend),
  SYS_START TIMESTAMP(12) GENERATED ALWAYS AS ROW BEGIN NOT NULL,
  SYS_END TIMESTAMP(12) GENERATED ALWAYS AS ROW END NOT NULL,
  TRANS_START TIMESTAMP(12) GENERATED ALWAYS AS TRANSACTION START ID IMPLICITLY HIDDEN,
  PERIOD SYSTEM_TIME(SYS_START, SYS_END),
  PRIMARY KEY (CAR_ID, business_time WITHOUT overlaps),
  CONSTRAINT CAR_FK FOREIGN KEY (CAR_PLATE)
      REFERENCES CARS.PLATE ON DELETE CASCADE
);

CREATE TABLE INSURANCE_HYSTORY LIKE INSURANCE;
ALTER TABLE INSURANCE ADD VERSIONING USE HISTORY TABLE INSURANCE_HYSTORY;

--Triggers
--En cancelación, disminuir precio
create trigger INSURANCE_CANCELATION
  after update on INSURANCE referencing
  old as old_values
  new as new_values
  for each row mode db2sql
  begin atomic
    update estadisticas
      set empDespedidos = empDespedidos +1; end

--En update no se puede disminuir las coverturas de poliza
CREATE TRIGGER INSURANCErestriction
BEFORE UPDATE OF  ON INSURANCE
REFERENCING OLD AS old_values NEW AS new_values
FOR EACH ROW mode DB2SQL
WHEN ( BETWEEN )
BEGIN
atomic
SIGNAL SQLSTATE '56001' ('No se puede incrementar mas del 30%');
END

--
