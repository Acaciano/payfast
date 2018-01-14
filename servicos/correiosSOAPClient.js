let soap = require('soap');

function CorreiosSOAPClient() {
  this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

module.exports = function () {
  return CorreiosSOAPClient;
}

CorreiosSOAPClient.prototype.calculaPrazo = (args, callback) => {
  soap.createClient(this._url, (erro, cliente) => {
    console.log('cliente soap criado');
    cliente.CalcPrazo(args, callback);
  });
}
