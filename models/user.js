function user(connection) {
    this._connection = connection;
}

user.prototype.getAll = function (callback) {
    this._connection.query('select * from user', callback);
}

user.prototype.authentication = function (user, callback) {
    this._connection.query("select * from user where email = ? and password = ?", [user.email, user.password], callback);
}

module.exports = function () {
    return user;
};
