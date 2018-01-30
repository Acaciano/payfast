let express = require('express');
let consign = require('consign');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let jwt = require('jsonwebtoken');
let authorization = require('../filters/authorization');

module.exports = function(){
  let app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(expressValidator());
  app.use(authorization);

  consign()
   .include('controllers')
   .then('persistencia')
   .then('models')
   .then('servicos')
   .then('helpers')
   .into(app,jwt);

  return app;
}
