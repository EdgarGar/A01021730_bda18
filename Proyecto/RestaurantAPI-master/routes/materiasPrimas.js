var express = require('express');
var router = express.Router();
var passport = require("passport");

let materiasPrimasController = require('./controllers/materiasPrimasController');
const passOps =  { session: false };
router.post('/hay/:id', passport.authenticate('jwt',passOps),materiasPrimasController.addThereIsMateriaPrimaRelationship);
router.get('/hay', passport.authenticate('jwt',passOps),materiasPrimasController.getThereIsMateriaPrimaRelationships);
router.get('/hay/:id', passport.authenticate('jwt',passOps),materiasPrimasController.getThereIsMateriaPrimaNodeRelationships);
router.put('/hay/:rid', passport.authenticate('jwt',passOps),materiasPrimasController.updateThereIsMateriaPrimaRelationship);
router.delete('/hay/:rid', passport.authenticate('jwt',passOps),materiasPrimasController.deleteThereIsMateriaPrimaRelationship);

router.get('/', passport.authenticate('jwt',passOps),materiasPrimasController.getMateriasPrimas);
router.get('/:id', passport.authenticate('jwt',passOps),materiasPrimasController.getMateriaPrima);
router.post('/', passport.authenticate('jwt',passOps),materiasPrimasController.addMateriaPrima);
router.put('/:id', passport.authenticate('jwt',passOps),materiasPrimasController.updateMateriaPrima);
router.delete('/:id', passport.authenticate('jwt',passOps),materiasPrimasController.deleteMateriaPrima);

module.exports = router;
