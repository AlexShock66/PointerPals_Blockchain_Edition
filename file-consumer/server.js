const express = require('express');
const app = express();
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser');
const port = 4000;
const multer = require('multer');
const SAVE_DEST = 'public/uploads/'
const upload = multer({dest:SAVE_DEST}).single('file');
// app.use(bodyParser.urlencoded({ extended: false }));
// var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
  }));

app.listen(port, () => {
  console.log(`Success! Your application is running on port ${port}.`);
});

app.post('/nft', (req, res) => {
    console.log('i am here');
    console.log(req.headers)
    // console.log(req.body);
    // fs.readFile(req.files.file.path, function(err, data){
    //   console.log(data)
    // });
    upload(req,res, (err) => {
      const file = req.file
      console.log(file)
      const extension = file.originalname.split('.')[1]
      console.log(extension)
      const savedFileName = SAVE_DEST.concat("/temp")
      fs.rename( file.path, savedFileName.concat('.',extension),function (err) {
        if (err) throw err;
        console.log('File Renamed.');
      });
      // const prevUrl = req.body.prevUrl.slice(21)
      if(!err) {
        // console.log(prevUrl)
        
      }
    })
})