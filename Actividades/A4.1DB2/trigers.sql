--create table estadisticas (numEmpleados int not null, empDespedidos int not null default 0, ventas decimal(10,2), provedores int not null)

--insert into estadisticas values(42,0,0.0,43)

--create trigger update_despedidos after delete on employee referencing old as old_values for each row mode db2sql begin atomic update estadisticas set empDespedidos = empDespedidos + 1; end

--select * from estadisticas

--select * from employee limit 2

--select * from employee where empno like '200340%'

--delete from employee where empno like '200340%'

--select * from estadisticas

--select * from employee limit 10

--delete from employee where empno like '200%'

--select * from estadisticas

--Triger que no permite incrementar el salario de un empleado en más de 30%

create trigger update_despedidos after delete on employee referencing old as old_values for each row mode db2sql begin atomic update estadisticas set empDespedidos = empDespedidos +1; end

--2Trigger que permite crear/insertar una orden de compras si hay suficientes productos--
--2Crea la tabla de ordenes de compra
create trigger incremento_salario before update on employee referencing old as old_values new as new_values for each row mode db2sql when(new_values.SALARY > (old_values.SALARY * 1.3)) begin atomic SIGNAL SQLSTATE '75001'; end

-- 3.Trigger que reduce la cantidad de productos del inventario cuando la orden de compra cambia a delivered

create trigger delivered_order after update on orders referencing old as old_values new as new_values for each row mode db2sql when(new_values.estado = 'delivered') begin atomic update inventory set QUANTITY = QUANTITY- old_values.cantidad_producto where PID = old_values.producto_id; end
        


