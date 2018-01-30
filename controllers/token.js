let config = require('../config/secret');

module.exports = function (app, jwt) {

    app.post('/token', function (req, res) {

        let user = undefined;
        let connection = app.persistencia.connectionFactory();
        let email = req.body.email ? req.body.email : '';
        let password = req.body.password ? req.body.password : '';

        let params = {
            email: email,
            password: password
        }

        new app.models.user(connection).authentication(params, function (erro, result) {
            if (erro) {
                res.status(500).send(erro);
                return;
            }

            user = result[0];
            const payload = {
                user
            };

            payload.user.password = '********';

            let token = jwt.sign(payload, config.secret, {
                expiresIn: 60
            });

            let expires_date = new Date();
            expires_date.setSeconds(60);

            res.json({
                expires_date,
                access_token: token,
                config: payload
            });

            return;
        });
    });
}
