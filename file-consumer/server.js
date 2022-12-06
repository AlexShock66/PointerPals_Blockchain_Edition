const express = require('express');
const app = express();
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser');
const JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNGYxM2Q1OC1lYmI2LTQ3ZWItOWNiZi1iYjRmYzExZjBlYzYiLCJlbWFpbCI6ImFsZXhzaG9ja2xleTY2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwODg2YWM4ZjNlMjkxZjdiMWQ2MiIsInNjb3BlZEtleVNlY3JldCI6IjMwZjM2N2FlMGJhNzFkYmIxYjMxMzIxOTQxOTVjZTg3ZWY1MjNmZDQ5MGYyNWE1M2M2ZGVmNzYwYjU5OGEzZWUiLCJpYXQiOjE2NzAzNTU3NDJ9.XQ9OBaBMfe8SU0o_btqQ3zB8_U5-GBS-YnqwV8cTTMo'
const axios = require('axios')
const FormData = require('form-data')

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


const pinFileToIPFS = async (filename,filepath) => {
  console.log("Filepath",filepath)
  console.log("Filename",filename)

  const formData = new FormData();
  const src = filepath;
  
  const file = fs.createReadStream(src)
  formData.append('file', file)
  
  const metadata = JSON.stringify({
    name: filename,
  });
  formData.append('pinataMetadata', metadata);
  
  const options = JSON.stringify({
    cidVersion: 0,
  })
  formData.append('pinataOptions', options);

  try{
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: JWT
      }
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

const uploadJson = async (name,filePath) => {
  var data = JSON.stringify({
    "pinataOptions": {
      "cidVersion": 1
    },
    "pinataMetadata": {
      "name": "testing",
      "keyvalues": {
        "customKey": "customValue",
        "customKey2": "customValue2"
      }
    },
    "pinataContent": {
      "somekey": "somevalue"
    }
  });
  
  var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': JWT
    },
    data : data
  };
  
  const res = await axios(config);
  
  // console.log(res.data);
  return res;
}

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
        pinFileToIPFS(file.originalname,savedFileName.concat('.',extension)).then((data) => {
            console.log(data)
            uploadJson("yurr","DoesntMatter").then( (response) => {
                console.log(response.data)
            }).catch( (e) => {
              console.log(e);
            })
        })
      });
      // const prevUrl = req.body.prevUrl.slice(21)
      if(!err) {
        // console.log(prevUrl)
        
      }
    })
})