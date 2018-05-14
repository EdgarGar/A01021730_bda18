var debug = require('debug')('restaurantapi:recetasController');
var config = require('../../config');
var jwt = require('jsonwebtoken');

var passport = require("passport");

let driver = require('../../config/neo4j').driver;
let neo4j = require('../../config/neo4j').neo4j;

let recteasData = ['name','cost','quantity'];
exports.getRecteas = function(req, res, next){
  let query = req.query;
  let session = driver.session();
  session.run('MATCH (m:Receta) RETURN collect(m) AS recetas')
  .then(response=>{
    let responseRecord = response.records[0];
    // debug("responseRecord",responseRecord);
    let mapedRecords = responseRecord._fields[0].map(record=>{
      // debug("record",record);
      let parsedRecord = record.properties;
      parsedRecord.id = record.identity.toInt();
      return parsedRecord;
    });
    res.json({success:true,items:mapedRecords});
  },error=>{
    debug("Error",error);
    return next(new Error("Error buscando las recetas"));
  })
};

exports.getRectea = function(req, res, next){
  let recteaId = parseInt(req.params.id);
  if(!recteaId){
    return next(new Error("No se seleccionó rectea"));
  }
  let session = driver.session();
  let query = [
    'MATCH (r:Receta)',
    'WHERE ID(r)={recteaId}',
    'return {',
    'name: r.name, id: id(r),',
    'cost: r.cost, quantity: r.quantity',
    '} as recetea'
  ].join(' ');
  session.run(query,{recteaId:recteaId})
  .then(response=>{
    let records = response.records;
    let item = null;
    if(records.length>0){
      item = records[0].toObject().recetea;
      item.id = item.id.toInt();
    }
    res.json({success:item?true:false, item:item});
  },error=>{
    debug("Error",error);
    return next(new Error("Error buscando las materias primas"));
  });
}

exports.addReceta = function(req, res, next) {
  let body = req.body;
  if( recteasData.every(value=> body.hasOwnProperty(value)) ){
    let session = driver.session();
    session.run(
      'MATCH (m:Receta {name: $name}) RETURN m',
      {name:req.body.name}
    ).then(response=>{
      if(response.records.length>0){
        // debug("match response",response);
        return next(new Error("La receta ya existe"));
      }
      session.run(
        `CREATE (m:Receta {
          name: $name,
          cost: $cost,
          quantity: $quantity
        }) RETURN m`,
        {name:req.body.name,cost: req.body.cost,quantity: req.body.quantity}
      ).then(response=>{
        let receta = response.records[0].get('m').properties;
        receta.id = response.records[0].get('m').identity.toInt();
        res.json({success:true, item:receta});
        session.close();
        driver.close();
      },error=>{
        debug("Error",error);
        return next(new Error("Error creando la receta"));
      });
    },error=>{
      debug("Error",error);
      return next(new Error("Error buscando la receta"));
    });
  }else{
    next((new Error('Faltan datos')));
  }
};

exports.updateReceta = function(req, res, next){
  let recetaId = parseInt(req.params.id);
  let body = req.body;
  // debug("recetaId",recetaId);
  if(recteasData.some(value=> body.hasOwnProperty(value))){
    let session = driver.session();
    let query = [
      'MATCH (m:Receta)',
      'WHERE id(m) = {recetaId}',
      'SET m += {props}',
			'RETURN m',
    ].join(' ');
    session.run(query,{recetaId:recetaId,props:body}).then(response=>{
      if(!response.records.length>0){
        return next(new Error("No se encontró la receta"));
      }else{
        res.json({success:true});
      }
    },error=>{
      debug("Error",error);
      return next(new Error("Error buscando la receta"));
    });
  }else{
    next((new Error('Datos incorrectos')));
  }
};

exports.deleteReceta = function(req, res, next){
  let recetaId = parseInt(req.params.id);
  // debug("recetaId",recetaId);
  let session = driver.session();
  let query = [
    'MATCH (m:Receta)',
    'WHERE id(m) = {recetaId}',
    'OPTIONAL MATCH (m)-[r]-()',
    'DELETE m, r',
  ].join(' ');
  session.run(query,{recetaId:recetaId})
  .then(response=>{
    if(!response.summary.updateStatistics.nodesDeleted()>0){
      return next(new Error("No se encontró la receta"));
    }else{
      res.json({success:true});
    }
  },error=>{
    debug("Error",error);
    return next(new Error("Error eliminando la receta, puede que aún tenga relaciones"));
  });
};

let needRelationshipData = ['quantity','materiaPrimaId'];
exports.addNeedMateriaRelationship = function(req, res, next){
  let recetaId = parseInt(req.params.id);
  let body = req.body;
  // debug("recetaId",recetaId);
  if( needRelationshipData.every(value=> body.hasOwnProperty(value)) ){
    let materiaPrimaId = parseInt(req.body.materiaPrimaId);
    delete body.materiaPrimaId;
    let session = driver.session();
    let query = [
      'MATCH (m:Receta),(mp:MateriaPrima)',
      'WHERE ID(m) = {recetaId} AND ID(mp) = {materiaPrimaId}',
      'CREATE (m)-[:NECESITA {quantity:{quantity}}]->(mp)',
      'SET m.cost = m.cost+ ( toInt(mp.cost) * toInt({quantity}) )'
    ].join(' ');
    session.run(query,{recetaId:recetaId, materiaPrimaId: materiaPrimaId, quantity: parseInt(body.quantity)})
    .then(response=>{
      debug("response",response);
      debug("response",response.summary.updateStatistics);
      if(!response.summary.updateStatistics.relationshipsCreated()>0){
        return next(new Error("No se encontró la receta"));
      }else{
        res.json({success:true});
      }
    },error=>{
      debug("Error",error);
      return next(new Error("Error buscando la receta"));
    });
  }else{
    next((new Error('Faltan datos')));
  }
};

// Regresa las recetas y lo que "necesitan" de materias primas  [(nodo + relaciones)]
exports.getNeedMateriaRelationships = function(req, res, next){
  let session = driver.session();
  let query = [
    'MATCH (r:Receta)-[h:NECESITA]->(mp)',
    'return {name: r.name, recetaId: id(r),',
    'necesita: collect({id: id(h), quantity: h.quantity, name: mp.name, materiaPrimaId: ID(mp)})',
    '} as receta'
  ].join(' ');
  session.run(query)
  .then(response=>{
    let records = response.records;
    let items = [];
    records.forEach(value=>{
      let newValue = value.get('receta');
      newValue.recetaId = newValue.recetaId.toInt();
      newValue.necesita.forEach(necesita=>{
        necesita.id = necesita.id.toInt();
        necesita.materiaPrimaId = necesita.materiaPrimaId.toInt();
        necesita.quantity = necesita.quantity.toInt?necesita.quantity.toInt():necesita.quantity;
      });
      items.push(newValue);
    });
    res.json({success:true, items:items});
  },error=>{
    debug("Error",error);
    return next(new Error("Error buscando las recetas"));
  });
}

// Regresa las receta y lo que "necesita" de materias primas (nodo + relaciones)
exports.getNeedMateriaNodeRelationships = function(req, res, next){
  let recetaId = parseInt(req.params.id);
  if(!recetaId){
    return next(new Error("No se seleccionó receta"));
  }
  let session = driver.session();
  let query = [
    'MATCH (r:Receta)-[h:NECESITA]->(mp)',
    'WHERE ID(r)={recetaId}',
    'return {name: r.name, recetaId: id(r),',
    'necesita: collect({id: id(h), quantity: h.quantity, name: mp.name, materiaPrimaId: ID(mp)})',
    '} as receta'
  ].join(' ');
  session.run(query,{recetaId:recetaId})
  .then(response=>{
    let records = response.records;
    let items = [];
    records.forEach(value=>{
      let newValue = value.get('receta');
      newValue.recetaId = newValue.recetaId.toInt();
      newValue.necesita.forEach(necesita=>{
        necesita.id = necesita.id.toInt();
        necesita.materiaPrimaId = necesita.materiaPrimaId.toInt();
        necesita.quantity = necesita.quantity.toInt?necesita.quantity.toInt():necesita.quantity;
      });
      items.push(newValue);
    });
    res.json({success:true, items:items});
  },error=>{
    debug("Error",error);
    return next(new Error("Error buscando la receta"));
  });
}

// Actualiza cantidad
exports.updateNeedMateriaRelationship = function(req, res, next){
  let relationId = parseInt(req.params.rid);
  let quantity = parseInt(req.body.quantity);
  if(!relationId || !quantity){
    return next(new Error("No se seleccionó la relación o el valor"));
  }
  let session = driver.session();
  let query = [
    'MATCH ()-[h:NECESITA]->()',
    'WHERE ID(h)={relationId}',
    'SET h.quantity = {quantity}',
    'RETURN h'
  ].join(' ');
  session.run(query,{relationId: neo4j.int(relationId), quantity: quantity})
  .then(response=>{
    if(!response.summary.updateStatistics.propertiesSet>0){
      return next(new Error("No se actualizó la relación"));
    }else{
      res.json({success:true});
    }
  },error=>{
    debug("Error",error);
    return next(new Error("Error buscando la receta"));
  });
}

// Borra la relación de que se necesita
exports.deleteNeedMateriaRelationship = function(req, res, next){
  let relationId = parseInt(req.params.rid);
  if(!relationId){
    return next(new Error("No se seleccionó la relación"));
  }
  let session = driver.session();
  let query = [
    'MATCH ()-[h:NECESITA]->()',
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
    return next(new Error("Error buscando la receta"));
  });
}
