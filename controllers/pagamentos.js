let authorize = require('../filters/authorize');

module.exports = function (app, jwt) {

  app.get('/pagamentos', function (req, res) {

      app.filters.authorize(jwt, req, res, function () {
      let connection = app.persistencia.connectionFactory();
      let pagamentoDao = new app.persistencia.PagamentoDao(connection);

      pagamentoDao.lista(function (erro, resultado) {
        if (erro) {
          res.status(500).send(erro);
          return;
        }
        res.json(resultado);
      });
    });
  });

  app.get('/pagamentos/pagamento/:id', function (req, res) {
    let id = req.params.id;

    let memcachedClient = app.servicos.memcachedClient();
    let connection = app.persistencia.connectionFactory();
    let pagamentoDao = new app.persistencia.PagamentoDao(connection);

    memcachedClient.get('pagamento-' + id, function (erro, retorno) {
      if (erro || !retorno) {

        pagamentoDao.buscaPorId(id, function (erro, resultado) {
          if (erro) {
            res.status(500).send(erro);
            return;
          }
          res.json(resultado);
        });

        return;
      }

      res.json(retorno);
    });
  });

  app.delete('/pagamentos/pagamento/:id', function (req, res) {
    let pagamento = {};
    let id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CANCELADO';

    let connection = app.persistencia.connectionFactory();
    let pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function (erro) {
      if (erro) {
        res.status(500).send(erro);
        return;
      }
      console.log('pagamento cancelado');
      res.status(204).send(pagamento);
    });
  });

  app.put('/pagamentos/pagamento/:id', function (req, res) {

    let pagamento = {};
    let id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CONFIRMADO';

    let connection = app.persistencia.connectionFactory();
    let pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function (erro) {
      if (erro) {
        res.status(500).send(erro);
        return;
      }
      console.log('pagamento criado');
      res.send(pagamento);
    });

  });

  app.post('/pagamentos/pagamento', function (req, res) {

    req.assert("pagamento.forma_de_pagamento",
      "Forma de pagamento eh obrigatorio").notEmpty();
    req.assert("pagamento.valor",
      "Valor eh obrigatorio e deve ser um decimal")
      .notEmpty().isFloat();

    let erros = req.validationErrors();

    if (erros) {
      console.log('Erros de validacao encontrados');
      res.status(400).send(erros);
      return;
    }

    let pagamento = req.body["pagamento"];
    console.log('processando uma requisicao de um novo pagamento');

    pagamento.status = 'CRIADO';
    pagamento.data = new Date;

    let memcachedClient = app.servicos.memcachedClient();
    let connection = app.persistencia.connectionFactory();
    let pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.salva(pagamento, function (erro, resultado) {
      if (erro) {
        console.log('Erro ao inserir no banco:' + erro);
        res.status(500).send(erro);
      } else {
        pagamento.id = resultado.insertId;

        memcachedClient.set('pagamento-' + pagamento.id, pagamento, 60, function (err) {
          console.log('nova chave: pagamento-' + pagamento.id);
        });

        if (pagamento.forma_de_pagamento == 'cartao') {
          let cartao = req.body["cartao"];
          let clienteCartoes = new app.servicos.clienteCartoes();

          clienteCartoes.autoriza(cartao,
            function (exception, request, response, retorno) {
              if (exception) {
                res.status(400).send(exception);
                return;
              }

              res.location('/pagamentos/pagamento/' +
                pagamento.id);

              res.status(201).json({
                dados_do_pagamanto: pagamento,
                cartao: retorno,
                links: [
                  {
                    href: "http://localhost:3000/pagamentos/pagamento/"
                      + pagamento.id,
                    rel: "confirmar",
                    method: "PUT"
                  },
                  {
                    href: "http://localhost:3000/pagamentos/pagamento/"
                      + pagamento.id,
                    rel: "cancelar",
                    method: "DELETE"
                  }
                ]
              });
              return;
            });


        } else {
          res.location('/pagamentos/pagamento/' +
            pagamento.id);

          res.status(201).json({
            dados_do_pagamanto: pagamento,
            links: [
              {
                href: "http://localhost:3000/pagamentos/pagamento/"
                  + pagamento.id,
                rel: "confirmar",
                method: "PUT"
              },
              {
                href: "http://localhost:3000/pagamentos/pagamento/"
                  + pagamento.id,
                rel: "cancelar",
                method: "DELETE"
              }
            ]
          });
        }
      }
    });

  });
}
