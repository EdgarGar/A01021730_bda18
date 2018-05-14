var debug = require('debug')('restaurantapi:queriesController');
var config = require('../../config');
var jwt = require('jsonwebtoken');

var passport = require("passport");

let driver = require('../../config/neo4j').driver;
let neo4j = require('../../config/neo4j').neo4j;

getExpireFunction = function(isToday){
  console.log("getExpireFunction",isToday);
  return function(req, res, next){
    let warehouseType = req.params.type;
    debug("warehouseType",warehouseType);
    let warehouseMatch = warehouseType=='materias'?
    'MATCH (mp:MateriaPrima)-[h:HAY]->()':
    warehouseType=='platillos'?
    'MATCH (mp:Receta)<-[h:ELABORA]-()':
    'MATCH (mp)-[h:ELABORA|HAY]-() WHERE mp:MateriaPrima OR mp:Receta WITH mp,h';
    let expiration = isToday?
    'WHERE h.expiration < {today} AND toInt(h.quantity) > 0':
    'WHERE h.expiration >= {today} AND  h.expiration < {futureExpiration} AND toInt(h.quantity) > 0';
    let session = driver.session();
    let query = [
      warehouseMatch,
      expiration,
      'WITH mp,h',
      'ORDER BY h.expiration',
      'WITH mp.name as mpName, collect(h) as hays, sum(h.quantity) as total, sum(toFloat(mp.cost) * toFloat(h.quantity)) as totalCost',
      'RETURN mpName, hays, total, totalCost'
    ].join(' ');
    let futureExpiration = new Date();
    futureExpiration.setDate(futureExpiration.getDate() + 7);
    futureExpiration = futureExpiration.getTime();
    let today = (new Date()).getTime();
    console.log("today",today,futureExpiration);
    session.run(query,{today: today,futureExpiration:futureExpiration})
    .then(response=>{
      // debug("response",response);
      let records = [];
      let finalCost = 0;
      response.records.forEach(record=>{
        let newHays = [];
        // debug("record",record);
        record = record.toObject();
        record.hays.forEach(hay=>{
          let newHay = Object.assign({},hay.properties);
          newHay.id = hay.identity.toInt();
          newHay.expiration = new Date(newHay.expiration.toNumber());
          newHays.push(newHay);
        });
        record.hays = newHays;
        finalCost += record.totalCost;
        records.push(record);
      });
      res.json({succcess:true, totalCost:finalCost, items:records});
    },error=>{
      debug("Error",error);
      return next(new Error("Error buscando"));
    });
  };
};

exports.getNearExpiration = getExpireFunction(false);
exports.getExpired = getExpireFunction(true);

exports.getWarehouseCost = function(req, res, next){
  let warehouseType = req.params.type;
  debug("warehouseType",warehouseType);
  let warehouseMatch = warehouseType=='materias'?
  'MATCH (mp:MateriaPrima)-[h:HAY]->()':
  warehouseType=='platillos'?
  'MATCH (mp:Receta)<-[h:ELABORA]-()':
  'MATCH (mp)-[h:ELABORA|HAY]-() WHERE mp:MateriaPrima OR mp:Receta';
  let session = driver.session();
  let query = [
    warehouseMatch,
    'WITH mp,h',
    'WHERE h.quantity > 0',
    'WITH mp,h',
    'ORDER BY h.expiration',
    'WITH mp.name as mpName, collect(h) as hays, sum(h.quantity) as total, sum(toFloat(mp.cost) * toFloat(h.quantity)) as totalCost',
    'RETURN mpName, hays, total, totalCost'
  ].join(' ');
  session.run(query)
  .then(response=>{
    // debug("response",response);
    let records = [];
    let finalCost = 0;
    response.records.forEach(record=>{
      let newHays = [];
      // debug("record",record);
      record = record.toObject();
      record.hays.forEach(hay=>{
        let newHay = Object.assign({},hay.properties);
        newHay.id = hay.identity.toInt();
        newHay.expiration = new Date(newHay.expiration.toNumber());
        newHays.push(newHay);
      });
      record.hays = newHays;
      finalCost += record.totalCost;
      records.push(record);
    });
    res.json({succcess:true, totalCost:finalCost, items:records});
  },error=>{
    debug("Error",error);
    return next(new Error("Error buscando"));
  });
};
