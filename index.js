let app = require('./config/custom-express')();

app.listen(4000, function () {
    console.log("Servidor rodando na porta 4000.");
});

