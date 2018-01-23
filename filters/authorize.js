let config = require('../config/secret');

function authorize(jwt, req, res, action) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, function (error, decoded) {
            if (error) {
                return res.json({ success: false, message: 'Falha ao autenticar.' });
            } else {
                action();
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'Nenhum token fornecido.'
        });
    }
}

module.exports = function () {
    return authorize;
};