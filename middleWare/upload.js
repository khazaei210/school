const multer = require('multer');
const News = require('../model/news');
const shelljs = require('shelljs');
const path = require('path');
var storage = multer.diskStorage({
    destination: async function (req, file, cb) {
       
      cb(null, 'public/img/temp')
    },
    filename: function (req, file, cb) {
        let fileType;
        const formatFile = file.originalname.split('.');
        fileType = formatFile[formatFile.length-1];
        cb(null, Date.now() + '.' + fileType) //Appending .jpg

    }
  })
  
  var upload = multer({ 
      storage: storage,
      limits: { 
                fileSize: 2000000 
            }, 
            fileFilter(req, file, cb) { 
               
                if (!file.originalname.match(/\.(jpeg|png|jpg|gif|jfif)$/)) { 
                    return cb(new Error('Please upload an image file')) 
                }
                
                cb(undefined, true) 
            } 
    });

module.exports = upload;