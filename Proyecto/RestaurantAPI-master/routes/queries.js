var express = require('express');
var router = express.Router();
var passport = require("passport");

let queriesController = require('./controllers/queriesController');
const passOps =  { session: false };

router.get('/caduca-pronto/:type', passport.authenticate('jwt',passOps),queriesController.getNearExpiration);
router.get('/costo-caducados/:type', passport.authenticate('jwt',passOps),queriesController.getExpired);
router.get('/costo-almacen/:type', passport.authenticate('jwt',passOps),queriesController.getWarehouseCost);

module.exports = router;
