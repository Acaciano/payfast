let memcached = require('memcached');

module.exports = function () {
    return createMencachedClient;
}

function createMencachedClient() {
    return new memcached('localhost:11211', {
        retries: 10, // numeros de tentativas para tentar buscar no cache
        retry: 10000, // só volta a tentar bater no servico em 10 segundos o tempo em uma falha do servidor
        remove: true
    });
}

// client.set('pagamento-20', { 'id': 20 }, 60000, function () {
//     console.log('nova chave adicionada ao cache: pagamento-20');
// });

// client.get('pagamento-20', function (erro, retorno) {
//     if (erro || !retorno) {
//         console.log('MISS - chave não encontrada');
//         return;
//     }

//     console.log('HIT - valor: ' + JSON.stringify(retorno));
// });