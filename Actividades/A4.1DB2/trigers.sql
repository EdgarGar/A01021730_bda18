create table estadisticas (numEmpleados int not null, empDespedidos int not null default 0, ventas decimal(10,2), provedores int not null)

insert into estadisticas values(42,0,0.0,43)

create trigger update_despedidos after delete on employee referencing old as old_values for each row mode db2sql begin atomic update estadisticas set empDespedidos = empDespedidos + 1; end

select * from estadisticas

select * from employee limit 2

select * from employee where empno like '200340%'

delete from employee where empno like '200340%'

select * from estadisticas

select * from employee limit 10

delete from employee where empno like '200%'

select * from estadisticas

--Triger que no permite incrementar el salario de un empleado en más de 30%

create trigger update_salario before update to employee referencing row mode db2sql when (new_salary employee > (OLD_EMP.SALARY * 1.30)) begin atomic signal sqlstate '75001' 

--Trigger que permite crear/insertar una orden de compras si hay suficientes productos--
--Crea la tabla de ordenes de compra
create table order(producto_id varchar(10) not null, catidad_producto int not null, estado varchar(15) not null)
create trigger pedir_orden
    before update on order
    referencing
        old as old_values
        new as old_values
    for each row mode db2sql
        when((select QUANTITY from inventary where(new_value.producto_id = PID)) < new_value.catidad_producto) begin
        


