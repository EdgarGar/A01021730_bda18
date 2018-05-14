var express = require('express');
var router = express.Router();
var passport = require("passport");

let recetasController = require('./controllers/recetasController');
const passOps =  { session: false };

router.post('/necesita/:id', passport.authenticate('jwt',passOps),recetasController.addNeedMateriaRelationship);
router.get('/necesita', passport.authenticate('jwt',passOps),recetasController.getNeedMateriaRelationships);
router.get('/necesita/:id', passport.authenticate('jwt',passOps),recetasController.getNeedMateriaNodeRelationships);
router.put('/necesita/:rid', passport.authenticate('jwt',passOps),recetasController.updateNeedMateriaRelationship);
router.delete('/necesita/:rid', passport.authenticate('jwt',passOps),recetasController.deleteNeedMateriaRelationship);

router.get('/', passport.authenticate('jwt',passOps),recetasController.getRecteas);
router.get('/:id', passport.authenticate('jwt',passOps),recetasController.getRectea);
router.post('/', passport.authenticate('jwt',passOps),recetasController.addReceta);
router.put('/:id', passport.authenticate('jwt',passOps),recetasController.updateReceta);
router.delete('/:id', passport.authenticate('jwt',passOps),recetasController.deleteReceta);


module.exports = router;
