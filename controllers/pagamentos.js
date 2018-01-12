module.exports = function (app) {

    app.get('/pagamentos', (req, res) => {
        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.pagamentoDao(connection);

        let x = pagamentoDao.lista(erro => {
            if (erro) {
                res.status(500).send(erro);
                return;
            }

            res.send(x);
        });
    });

    app.delete('/pagamentos/pagamento/:id', (req, res) => {
        let pagamento = {};
        let id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CANCELADO';

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.pagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, erro => {
            if (erro) {
                res.status(500).send(erro);
                return;
            }
            res.send(pagamento);
        });

    });

    app.put('/pagamentos/pagamento/:id', (req, res) => {

        let pagamento = {};
        let id = req.params.id;
        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.pagamentoDao(connection);

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        pagamentoDao.atualiza(pagamento, erro => {
            if (erro) {
                res.status(500).send(erro);
                return;
            }

            res.send(pagamento);
        });
    })

    app.post('/pagamentos/pagamento', (req, res) => {
        let pagamento = req.body;

        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
        req.assert("valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
        req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3, 3);

        var errors = req.validationErrors();

        if (errors) {
            console.log("Erros de validação encontrados");
            res.status(400).send(errors);
            return;
        }

        pagamento.status = "CRIADO";
        pagamento.data = new Date;

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.pagamentoDao(connection);

        pagamentoDao.salva(pagamento, (erro, resultado) => {
            if (erro) {
                console.log('Erro ao inserir no banco:' + erro);
                res.status(500).send(erro);
                return;
            }

            pagamento.id = resultado.insertId;

            let result = {
                dados_do_pagamento: pagamento,
                links: [
                    {
                        href: `http://localhost:4000/pagamentos/pagamento/${pagamento.id}`,
                        rel: 'confirmar',
                        method: 'PUT'
                    }
                ]
            };

            res.status(201).json(result);
        });
    });
}

