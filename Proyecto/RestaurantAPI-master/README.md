# RestaurantAPI
Proyecto para bases de datos avanzadas


# Ejecutar

## Docker

Ejecutar en termminal:

    $ docker-compose up  
      ó
    $ sudo docker-compose up

# Resumen de rutas (API)

### Auth
>* POST /register
>  * ( username: string, password: string, email: string )=>{succcess:boolean}
>* POST /login
>  * ( username: string, password: string )=>{succcess:boolean, token:string}
>* GET /isLoggedIn
>  * ( )=>{succcess:boolean}

### MateriasPrimas (node)
>* GET /materias-primas
>* GET /materias-primas/:id
>* POST /materias-primas
>* PUT /materias-primas/:id
>* DELETE /materias-primas/:id

### Hay [relationship]
>* GET /materias-primas/hay
>* GET /materias-primas/hay/:id
>* POST /materias-primas/hay/:id
>* PUT /materias-primas/hay/:rid
>* DELETE /materias-primas/hay/:rid

### Recetas (node)
>* GET /recetas
>* GET /recteas/:id
>* POST /recteas
>* PUT /recteas/:id
>* DELETE /recteas/:id

### Necesita [relationship]
>* GET /recetas/necesita
>* GET /recetas/necesita/:id
>* POST /recetas/necesita/:id
>* PUT /recetas/necesita/:rid
>* DELETE /recetas/necesita/:rid

### Elabora [relationship]
>* GET /users/elabora
>* GET /users/elabora/:recetaid
>* POST /users/elabora/:nid
>* DELETE /users/elabora/:rid

### Queries

>* GET /caduca-pronto/:type (7 días)
>* GET /costo-caducados/:type
>* GET /costo-almacen/:type  
>
>`type: { platillos | materias | ambos }`

### Referencias

`https://github.com/mfong/node-neo4j-passport-template/blob/master/package.json`
