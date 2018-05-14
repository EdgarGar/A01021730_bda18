var debug = require('debug')('restaurantapi:materiasPrimasController');
var config = require('../../config');
var jwt = require('jsonwebtoken');

var passport = require("passport");

let driver = require('../../config/neo4j').driver;

let materiasPrimasData = ['name','cost','category'];
exports.getMateriasPrimas = function(req, res, next){
  let query = req.query;
  let session = driver.session();
  session.run('MATCH (m:MateriaPrima) RETURN collect(m) AS materias')
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
    return next(new Error("Error buscando las materias primas"));
  });
};

exports.getMateriaPrima = function(req, res, next){
  let materiaId = parseInt(req.params.id);
  if(!materiaId){
    return next(new Error("No se seleccionó materia prima"));
  }
  let session = driver.session();
  let query = [
    'MATCH (mp:MateriaPrima)',
    'WHERE ID(mp)={materiaId}',
    'RETURN {',
    'name: mp.name, id: id(mp),',
    'cost: mp.cost, category: mp.category',
    '} as materiaPrima'
  ].join(' ');
  session.run(query,{materiaId:materiaId})
  .then(response=>{
    let records = response.records;
    let item = null;
    if(records.length>0){
      item = records[0].toObject().materiaPrima;
      item.id = item.id.toInt();
    }
    res.json({success:item?true:false, item:item});
  },error=>{
    debug("Error",error);
    return next(new Error("Error buscando las materias primas"));
  });
}

exports.addMateriaPrima = function(req, res, next) {
  let body = req.body;
  if( materiasPrimasData.every(value=> body.hasOwnProperty(value)) ){
    let session = driver.session();
    session.run(
      'MATCH (m:MateriaPrima {name: $name}) RETURN m',
      {name:req.body.name}
    ).then(response=>{
      if(response.records.length>0){
        return next(new Error("La materia prima ya existe"));
      }
      session.run(
        `CREATE (m:MateriaPrima {
          name: $name,
          cost: $cost,
          category: $category
        }) RETURN m`,
        {name:req.body.name,cost: req.body.cost,category: req.body.category}
      ).then(response=>{
        let materia = response.records[0].get('m').properties;
        materia.id = response.records[0].get('m').identity.toInt();
        res.json({success:true, item:materia});
        session.close();
        driver.close();
      },error=>{
        debug("Error",error);
        return next(new Error("Error creando la materia prima"));
      });
    },error=>{
      debug("Error",error);
      return next(new Error("Error buscando la materia prima"));
    });
  }else{
    next((new Error('Faltan datos')));
  }
};

exports.updateMateriaPrima = function(req, res, next){
  let materiaId = parseInt(req.params.id);
  let body = req.body;
  if(materiasPrimasData.some(value=> body.hasOwnProperty(value))){
    let session = driver.session();
    let query = [
      'MATCH (m:MateriaPrima)',
      'WHERE id(m) = {materiaId}',
      'SET m += {props}',
			'RETURN m',
    ].join(' ');
    session.run(query,{materiaId:materiaId,props:body}).then(response=>{
      if(!response.records.length>0){
        return next(new Error("No se encontró la materia prima"));
      }else{
        res.json({success:true});
      }
    },error=>{
      debug("Error",error);
      return next(new Error("Error buscando la materia prima"));
    });
  }else{
    next((new Error('Datos incorrectos')));
  }
};

exports.deleteMateriaPrima = function(req, res, next){
  let materiaId = parseInt(req.params.id);
  let session = driver.session();
  let query = [
    'MATCH (m:MateriaPrima)',
    'WHERE id(m) = {materiaId}',
    'OPTIONAL MATCH (m)-[r]-()',
    'DELETE m, r',
  ].join(' ');
  session.run(query,{materiaId:materiaId})
  .then(response=>{
    if(!response.summary.updateStatistics.nodesDeleted()>0){
      return next(new Error("No se encontró la materia prima"));
    }else{
      res.json({success:true});
    }
  },error=>{
    debug("Error",error);
    return next(new Error("Error eliminando la materia prima, puede que aún tenga relaciones"));
  });
};

let thereIsRelationshipData = ['quantity','expiration'];
exports.addThereIsMateriaPrimaRelationship = function(req, res, next){
  let materiaId = parseInt(req.params.id);
  let body = req.body;
  // debug("materiaId",materiaId);
  if( thereIsRelationshipData.every(value=> body.hasOwnProperty(value)) ){
    let session = driver.session();
    let query = [
      'MATCH (m:MateriaPrima)',
      'WHERE id(m) = {materiaId}',
      'CREATE (m)-[:HAY {thereIsData}]->(m)',
    ].join(' ');
    session.run(query,{materiaId:materiaId, thereIsData: body})
    .then(response=>{
      // debug("response",response.summary.updateStatistics);
      if(!response.summary.updateStatistics.relationshipsCreated()>0){
        return next(new Error("No se agregó la relación"));
      }else{
        res.json({success:true});
      }
    },error=>{
      debug("Error",error);
      return next(new Error("Error buscando la materia prima"));
    });
  }else{
    next((new Error('Faltan datos')));
  }
};
// Regresa todas las materias primas y cuantos "hay" [(nodo + relaciones)]
exports.getThereIsMateriaPrimaRelationships = function(req, res, next){
  let session = driver.session();
  let query = [
    'MATCH (mp:MateriaPrima)-[h:HAY]->()',
    'WITH mp, h',
    'ORDER BY h.expiration',
    'RETURN {name: mp.name, materiaPrimaId: id(mp),',
    'hay: collect({id: id(h), quantity: h.quantity, expiration: h.expiration})',
    '} as materiaPrima'
  ].join(' ');
  session.run(query)
  .then(response=>{
    let records = response.records;
    let items = [];
    records.forEach(value=>{
      let newValue = value.get('materiaPrima');
      newValue.materiaPrimaId = newValue.materiaPrimaId.toInt();
      let total = 0;
      newValue.hay.forEach(hay=>{
        hay.id = hay.id.toInt();
        hay.expiration = new Date(hay.expiration.toNumber?hay.expiration.toNumber():hay.expiration);
        hay.quantity = hay.quantity.toInt?hay.quantity.toInt():hay.quantity;
        total += hay.quantity;
      });
      newValue.total = total;
      items.push(newValue);
    });
    res.json({success:true, items:items});
  },error=>{
    debug("Error",error);
    return next(new Error("Error buscando las materias primas"));
  });
}

// Regresa la materia prima y cuantos "hay" (nodo + relaciones)
exports.getThereIsMateriaPrimaNodeRelationships = function(req, res, next){
  let materiaId = parseInt(req.params.id);
  if(!materiaId){
    return next(new Error("No se seleccionó materia prima"));
  }
  let session = driver.session();
  let query = [
    'MATCH (mp:MateriaPrima)-[h:HAY]->()',
    'WHERE ID(mp)={materiaId}',
    'RETURN {name: mp.name, materiaPrimaId: id(mp),',
    'hay: collect({id: id(h), quantity: h.quantity, expiration: h.expiration})',
    '} as materiaPrima'
  ].join(' ');
  session.run(query,{materiaId:materiaId})
  .then(response=>{
    let records = response.records;
    let items = [];
    records.forEach(value=>{
      let newValue = value.get('materiaPrima');
      newValue.materiaPrimaId = newValue.materiaPrimaId.toInt();
      newValue.hay.forEach(hay=>{
        hay.id = hay.id.toInt();
        hay.expiration = new Date(hay.expiration.toNumber?hay.expiration.toNumber():hay.expiration);
        hay.quantity = hay.quantity.toInt?hay.quantity.toInt():hay.quantity;
      });
      items.push(newValue);
    });
    res.json({success:true, items:items});
  },error=>{
    debug("Error",error);
    return next(new Error("Error buscando la materia prima"));
  });
}

// Actualiza cantidad o fecha de cuantos hay
exports.updateThereIsMateriaPrimaRelationship = function(req, res, next){
  let relationId = parseInt(req.params.rid);
  let quantity = parseInt(req.body.quantity);
  if(!relationId || !quantity){
    return next(new Error("No se seleccionó la relación o el valor"));
  }
  let session = driver.session();
  let query = [
    'MATCH ()-[h:HAY]->()',
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
    return next(new Error("Error actualizando la relación"));
  });
}

// Borra la relación de cuanto hay
exports.deleteThereIsMateriaPrimaRelationship = function(req, res, next){
  let relationId = parseInt(req.params.rid);
  if(!relationId){
    return next(new Error("No se seleccionó la relación"));
  }
  let session = driver.session();
  let query = [
    'MATCH ()-[h:HAY]->()',
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
}
