var debug = require('debug')('restaurantapi:usersController');
var config = require('../../config');
var jwt = require('jsonwebtoken');

var passport = require("passport");

let driver = require('../../config/neo4j').driver;
let neo4j = require('../../config/neo4j').neo4j;

let needRelationshipData = ['quantity'];
exports.addElaborateRecetaRelationship = function(req, res, next){
  let userId = req.user.id;
  let body = req.body;
  debug("userId",userId);
  if( needRelationshipData.every(value=> body.hasOwnProperty(value)) ){
    let recetaId = parseInt(req.params.nid);
    let recetaQuantity = parseInt(body.quantity);
    debug("recetaId",recetaId);
    debug("recetaQuantity",recetaQuantity);
    // PASOS:
    // Obtener las materias primas que "hay"
    // Verificar que materias primas se va a usuar
    // Seleccionar fecha de expiración, la más temprana
    // Crear relación "ELABORA" y actualizar relaciones "HAY"
    let session = driver.session();
    /*
    MATCH (r:Receta)-[n:NECESITA]->(mp:MateriaPrima)-[h:HAY]->()
    WHERE id(r)=361 AND h.quantity >= n.quantity
    WITH mp, n, min(h.expiration) as expirationV, collect(h) as hays
    WITH mp.name as mpName, n as necesita, [hs IN hays WHERE hs.expiration = expirationV][0] as hay
    RETURN hay
    */
    /*
    MATCH (r:Receta)-[n:NECESITA]->(mp:MateriaPrima)-[h:HAY]->()
    WHERE id(r)=361 AND h.expiration > "05-05-2018"
    WITH r,n,mp,h
    ORDER BY h.expiration
    WITH mp.name as mpName, n.quantity  as necesita, collect(h) as hays
    RETURN mpName,necesita,hays
    */

    let query = [
      'MATCH (r:Receta)-[n:NECESITA]->(mp:MateriaPrima)-[h:HAY]->()',
      'WHERE id(r)={recetaId} AND h.expiration >= {today}',
      'WITH r,n,mp,h',
      'ORDER BY h.expiration',
      'WITH mp.name as mpName, n.quantity  as necesita, collect(h) as hays, sum(h.quantity) as total',
      'RETURN mpName,necesita,hays, total'
    ].join(' ');
    let today = (new Date()).getTime();
    debug("today",today);
    session.run(query,{recetaId: recetaId, today: today})
    .then(response=>{
      // debug("response",response.summary.updateStatistics);
      // if(!response.summary.updateStatistics.relationshipsCreated()>0){
      //   return next(new Error("No se agregó la relación"));
      // }else{
      //   res.json({success:true});
      // }
      let responseRecords = response.records;
      let records = [];
      let expiration = null;
      let haysIds = [];
      responseRecords.forEach(record=>{
        let parsedRecord = records[records.push(record.toObject())-1];
        if(parsedRecord.necesita > parsedRecord.total){
          return res.json({success:false,message:"No se cuenta con materias primas suficientes de: "+parsedRecord.mpName});
        }
        // debug("parsedRecord",parsedRecord);
        let needs = parsedRecord.necesita*recetaQuantity;
        // debug("needs",needs);
        parsedRecord.hays.forEach(hay=>{
          let hayProp = hay.properties;
          let hayId = hay.identity.toInt();
          // debug("hay",hayId);
          // debug("quantity",hayProp.quantity);
          if(needs>0){
            let quantity = (hayProp.quantity>needs)?hayProp.quantity-needs:0;
            // debug("quantity2",quantity);
            haysIds.push({hayId: neo4j.int(hayId),quantity:quantity});
            needs -= hayProp.quantity;
            // debug("needs2",needs);
            expiration = expiration?(expiration>hayProp.expiration)?hayProp.expiration:expiration:hayProp.expiration;
          }
        });
      });
      haysIds.forEach(hay=>{debug("hay",hay)});
      debug("expiration",expiration);
      debug("records",records);
      let query = [
        'MATCH (u:User),(mp:Receta)',
        'WHERE ID(u) = {userId} AND ID(mp) = {recetaId}',
        'CREATE (u)-[r:ELABORA {quantity:{quantity}, expiration:{expiration}}]->(mp)',
        'SET r.cost = r.cost+ ( toInt(mp.cost) * toInt({quantity}) )',
        'WITH r',
        'UNWIND {haysIds} as hay',
        'MATCH ()-[h]-()',
        'WHERE ID(h) = hay.hayId',
        'SET h.quantity = hay.quantity',
        'RETURN r'
      ].join(' ');
      let params = {
        userId: userId,
        recetaId: recetaId,
        quantity: recetaQuantity,
        expiration:expiration,
        haysIds: haysIds
      };
      session.run(query,params)
      .then(response=>{
        debug("response",response);
        res.json({success:true});
      },error=>{
        debug("Error",error);
        return next(new Error("Error buscando la receta"));
      });
    },error=>{
      debug("Error",error);
      return next(new Error("Error buscando la receta"));
    });
  }else{
    next((new Error('Faltan datos')));
  }
};

// Regresa los usuarios y lo que "elaboraron" de recetas  [(nodo + relaciones)]
exports.getElaborateRecetaRelationships = function(req, res, next){
  let session = driver.session();
  let query = [
    'MATCH (r:Receta)<-[e:ELABORA]-()',
    'WITH r, e',
    'ORDER BY e.expiration',
    'RETURN {name: r.name, recetaId: id(r),',
    'elaborado: collect({id: id(e), quantity: e.quantity, expiration: e.expiration})',
    '} as receta'
  ].join(' ');
  session.run(query)
  .then(response=>{
    let records = response.records;
    let items = [];
    let fullTotal = 0;
    records.forEach(value=>{
      let newValue = value.get('receta');
      newValue.recetaId = newValue.recetaId.toInt();
      let total = 0;
      newValue.elaborado.forEach(elabora=>{
        // debug("elabora",elabora);
        elabora.id = elabora.id.toInt();
        elabora.expiration = new Date(elabora.expiration.toNumber?elabora.expiration.toNumber():elabora.expiration);
        elabora.quantity = elabora.quantity.toInt?elabora.quantity.toInt():elabora.quantity;
        total += elabora.quantity;
      });
      newValue.total = total;
      fullTotal+= total;
      items.push(newValue);
    });
    res.json({success:true, items:items, total:fullTotal});
  },error=>{
    debug("Error",error);
    return next(new Error("Error buscando las materias primas"));
  });
};

// Regresa el usuario y lo que "elaboro" de recetas (nodo + relaciones)
exports.getElaborateRecetaNodeRelationships = function(req, res, next){
  let session = driver.session();
  let recetaId = req.params.recetaid;
  debug("recetaId",recetaId);
  let query = [
    'MATCH (r:Receta)<-[e:ELABORA]-()',
    'WHERE ID(r)={recetaId}',
    'WITH r, e',
    'ORDER BY e.expiration',
    'RETURN {name: r.name, recetaId: id(r),',
    'elaborado: collect({id: id(e), quantity: e.quantity, expiration: e.expiration})',
    '} as receta'
  ].join(' ');
  session.run(query,{recetaId: neo4j.int(recetaId)})
  .then(response=>{
    debug("response",response);
    let records = response.records;
    let items = [];
    let fullTotal = 0;
    records.forEach(value=>{
      let newValue = value.get('receta');
      debug("newValue",newValue);
      newValue.recetaId = newValue.recetaId.toInt();
      let total = 0;
      newValue.elaborado.forEach(elabora=>{
        // debug("elabora",elabora);
        elabora.id = elabora.id.toInt();
        elabora.expiration = new Date(elabora.expiration.toNumber?elabora.expiration.toNumber():elabora.expiration);
        elabora.quantity = elabora.quantity.toInt?elabora.quantity.toInt():elabora.quantity;
        total += elabora.quantity;
      });
      newValue.total = total;
      fullTotal+= total;
      items.push(newValue);
    });
    res.json({success:true, items:items, total:fullTotal});
  },error=>{
    debug("Error",error);
    return next(new Error("Error buscando las materias primas"));
  });
};

// Borra la relación de que se elaboro
exports.deleteElaborateRecetaRelationship = function(req, res, next){
  let relationId = parseInt(req.params.rid);
  if(!relationId){
    return next(new Error("No se seleccionó la relación"));
  }
  let session = driver.session();
  let query = [
    'MATCH ()-[h:ELABORA]->()',
    'WHERE ID(h)={relationId}',
    'DELETE h'
  ].join(' ');
  session.run(query,{relationId: neo4j.int(relationId)})
  .then(response=>{
    if(!response.summary.updateStatistics.relationshipsDeleted>0){
      return next(new Error("No se actualizó la relación"));
    }else{
      res.json({success:true});
    }
  },error=>{
    debug("Error",error);
    return next(new Error("Error eliminando la relación"));
  });
};
