const express = require('express');
const app = express();
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser');
const JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhMTcwZGIzOC1jMjI4LTRmYTktOTcwYi1hZDFiN2E2NjM3NWIiLCJlbWFpbCI6Im5vdGpheXNlbWFpbEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNGIzM2ZmNWI2MDJjMTdhNjI4OTQiLCJzY29wZWRLZXlTZWNyZXQiOiIwYzUzOTMxMWQ3NGUyYmU4YmMwNzdkN2E1ZjU0OGIyNDZiOWRhNDI2NzdkZWNjMzFmMzQxMWU5NTMzY2I1MTljIiwiaWF0IjoxNjcwMzcxNjU3fQ.xOOU9y-SWCsTUw_oIY4VkMvooC-dni8du7dUcTsTkrk'
const axios = require('axios')
const FormData = require('form-data')

const port = 4000;
const multer = require('multer');
const SAVE_DEST = 'public/uploads/'
const upload = multer({dest:SAVE_DEST}).single('file');

const mintNFT = require('./scripts/mint-nft');
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

const uploadJson = async (name, hash) => {
  var data = JSON.stringify({
    "pinataOptions": {
      "cidVersion": 1
    },
    "pinataMetadata": {
      "name": `${name}-metadata.json`,
      // "keyvalues": {
      //   "customKey": "customValue",
      //   "customKey2": "customValue2"
      // }
    },
    "pinataContent": {
      "name": name,
      "image": `ipfs://${hash}`
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
            uploadJson(req.headers.name, data.IpfsHash).then( (response) => {
                mintNFT.mintNFT(`ipfs://${response.data.IpfsHash}`).then( res => {
                  console.log(res);
                });
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