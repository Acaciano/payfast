let mysql = require('mysql');

function createDBConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'aa251006@10',
        // password: '',
        database: 'payfast',
    });
}

module.exports = function () {
    return createDBConnection;
}