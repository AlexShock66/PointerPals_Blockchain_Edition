const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const port = 4000;

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
    console.log(req.json());
})