let express = require('express');
let consign = require('consign');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let jwt = require('jsonwebtoken');

module.exports = function(){
  let app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use(expressValidator());

  consign()
   .include('controllers')
   .then('persistencia')
   .then('servicos')
   .then('helpers')
   .then('filters')
   .into(app,jwt);

  return app;
}
