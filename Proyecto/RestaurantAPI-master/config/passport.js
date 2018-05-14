var debug = require('debug')('restaurantapi:passport-config');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var config = require('./');

let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver(config.neo4j.url, neo4j.auth.basic(config.neo4j.username, config.neo4j.password));

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use('jwt',new JwtStrategy(opts, function(jwt_payload, done) {
    // debug("jwt_payload user",jwt_payload);
    let session = driver.session();
    session.run('MATCH (u:User) WHERE ID(u)=$userId RETURN u',{userId:jwt_payload.id})
    .then((response)=>{
      if (response.records.length>0) {
        let user = response.records[0].get('u').properties;
        user.id = response.records[0].get('u').identity.toInt();
        // debug("user",user);
        done(null, user);
      } else {
        done(null, false);
      }
    },(error)=>{
      return done(err, false);
    });
  },(error)=>{
    debug("error",error);
  }));
};
