let express = require('express');
let router = express.Router();
let config = require('../config/secret');
let jwt = require('jsonwebtoken');

router.use(function (req, res, next) {
	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	let route = req.url.toLowerCase();

	if (route != '/token') {
		if (token) {
			jwt.verify(token, config.secret, function (error, decoded) {
				if (error) {
					return res.json({ success: false, message: 'Falha ao autenticar.' });
				} else {
					next();
				}
			});
		} else {
			return res.status(403).send({
				success: false,
				message: 'Nenhum token fornecido.'
			});
		}
	}else{
		next();
	}
});

module.exports = router;