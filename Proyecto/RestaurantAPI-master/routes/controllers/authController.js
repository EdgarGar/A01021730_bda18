var debug = require('debug')('restaurantapi:authController');
var config = require('../../config');
var jwt = require('jsonwebtoken');

var passport = require("passport");

let driver = require('../../config/neo4j').driver;

exports.loginUser = function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  if( username && password ){
    let session = driver.session();
    session.run(
      'MATCH (u:User {name: $name}) RETURN u',
      {name:req.body.username}
    ).then(response=>{
      if(response.records.length==0){
        return res.json({
          success:false,
          token:null,
          message: "No se encontró el usuario"
        });
      }
      let user = response.records[0].get('u');
      debug("create response",user);
      if(user.properties.password == req.body.password){
        res.json({
          success:true,
          token: signUser(user.identity.toInt(),user.properties.name)
        });
      }else{
        res.json({success:false, token: null, message:"Contraseña incorrecta"});
      }
      session.close();
      driver.close();
    },error=>{
      debug("Error",error);
      return next(new Error("Error buscando el usuario"));
    });
  }else{
    next((new Error('Faltan credenciales')));
  }
}
let userData = ['username','password', 'email'];
exports.registerUser = function(req,res,next){
  let body = req.body;
  if( userData.every(value=> body.hasOwnProperty(value)) ){
    let session = driver.session();
    session.run(
      'MATCH (u:User) WHERE u.name = $name OR u.email = $email RETURN u',
      {name:req.body.username, email:req.body.email}
    ).then(response=>{
      if(response.records.length>0){
        debug("match response",response);
        return next(new Error("El usuario o correo ya existe "));
      }
      session.run(
        'CREATE (u:User {name: $name, password: $password, email: $email}) RETURN u',
        {name:req.body.username,password: req.body.password, email: req.body.email}
      ).then(response=>{
        let user = response.records[0].get('u');
        debug("create response",user);
        res.json({
          success:true,
          token: signUser(user.identity.toInt(),user.properties.name)
        });
        session.close();
        driver.close();
      },error=>{
        debug("Error",error);
        return next(new Error("Error creando el usuario"));
      });
    },error=>{
      debug("Error",error);
      return next(new Error("Error buscando el usuario"));
    });
  }else{
    next((new Error('Faltan datos')));
  }

}
let signUser = (userId, userName)=>{
  var tokenUser = {name:'',id:''};
  tokenUser.name = userName;
  tokenUser.id = userId;
  return jwt.sign(tokenUser, config.secret);
}

exports.isLoggedIn = function(req,res,next){
  debug("req.user",req.user);
  if( req.user ){
    res.json({success:true});
  }else{
    next((new Error('No autorizado')));
  }
}
