let config = require('../config/secret');

module.exports = function (app, jwt) {

    app.get('/token', function (req, res) {
        let user = { id: 3 };

        let token = jwt.sign(user, config.secret, {
            expiresIn: 60
        });

        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
    });
}
