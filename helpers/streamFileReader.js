let fs = require('fs');

fs.createReadStream('img.jpg')
    .pipe(fs.createWriteStream('img2.jpg'))
    .on('finish', function(){
        console.log('Arquivo escrito com stream.');
    });