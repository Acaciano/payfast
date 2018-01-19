let fs = require('fs');

fs.readFile('img.jpg', function(error, buffer){
    fs.writeFile('img2.jpg', buffer, function(error){
        console.log('Arquivo escrito.');
    });
});