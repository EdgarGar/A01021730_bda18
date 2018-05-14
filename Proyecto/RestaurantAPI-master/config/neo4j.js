var debug = require('debug')('restaurantapi:neo4j');

let neo4j = require('neo4j-driver').v1;
var config = require('./');

module.exports = (function(){
  return {neo4j:neo4j,driver:neo4j.driver(
    config.neo4j.url,
    neo4j.auth.basic(config.neo4j.username, config.neo4j.password)
  )};
})()
