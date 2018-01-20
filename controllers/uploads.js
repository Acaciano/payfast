let fs = require('fs');

module.exports = function(app){
    app.post('/upload/imagem', function(req, res){
        let guidHelper = new app.helpers.guidHelper();
        let name = guidHelper.newguid() + '.jpg';
        req.pipe(fs.createWriteStream('files/' + name))
        .on('finish', function () {
            res.status(201).send('OK');
        })
    });
}