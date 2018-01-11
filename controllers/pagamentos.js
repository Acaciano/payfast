module.exports = function (app) {
    app.get('/pagamentos', function (req, res) {
        console.log('Recebida requisição de teste.');
        res.send('Ok.');
    });

    app.post("/pagamentos/pagamento", function (req, res) {
        let pagamento = req.body;
        console.log('processando pagamento...');

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.pagamentoDao(connection);

        pagamentoDao.salva(pagamento, function (exception, result) {
            console.log('pagamento criado: ' + result);
            res.json(pagamento);
        });
    });
}

