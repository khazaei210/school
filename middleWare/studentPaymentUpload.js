const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/img/docs/${req.student.nationalID}/payments`)
    },
    filename: function (req, file, cb) {

      let fileType;
      const formatFile = file.originalname.split('.');
      fileType = formatFile[formatFile.length-1];
      cb(null, Date.now() + '.' + fileType) //Appending .jpg
    }
  })
  
  var studentDocsUpload = multer({ 
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

module.exports = studentDocsUpload;