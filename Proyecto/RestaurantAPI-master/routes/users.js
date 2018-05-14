// var debug = require('debug')('restaurantapi:users');
var express = require('express');
var router = express.Router();
var passport = require("passport");

let usersController = require('./controllers/usersController');
const passOps =  { session: false };

router.post('/elabora/:nid', passport.authenticate('jwt',passOps),usersController.addElaborateRecetaRelationship);
router.get('/elabora', passport.authenticate('jwt',passOps),usersController.getElaborateRecetaRelationships);
router.get('/elabora/:recetaid', passport.authenticate('jwt',passOps),usersController.getElaborateRecetaNodeRelationships);
router.delete('/elabora/:rid', passport.authenticate('jwt',passOps),usersController.deleteElaborateRecetaRelationship);

// router.get('/', function(req, res, next) {
//   let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "admin"));
//   let session = driver.session();
//   session
//   // .run('MERGE (james:Person {name : {nameParam} }) RETURN james.name AS name', {nameParam: 'James'})
//   .run('MATCH (p:Person)  RETURN collect(p) AS persons,  length(collect(p)) AS count')
//   .then(function (result) {
//     debug("result",result.records[0]);
//     let resultArray = [];
//     // result.records.forEach(function (record) {
//     //   // debug(record);
//     //   resultArray.push(record.get('p.name')+' - '+record.get('p.born')+' - '+record.get('count'));
//     // });
//     let personsArray = result.records[0].get('persons');
//     let personsCount = result.records[0].get('count');
//     debug("personsArray",personsArray);
//     debug("personsCount",personsCount);
//     personsArray.forEach(function (node) {
//       // debug(record);
//       let props = node.properties;
//       resultArray.push(props.name+' - '+props.born);
//     });
//     resultArray.sort();
//     res.json({succcess:true,items:resultArray,count:personsCount.toNumber()});
//     session.close();
//     driver.close();
//   })
//   .catch(function (error) {
//     debug(error);
//     next(error);
//     driver.close();
//   });
// });

module.exports = router;
