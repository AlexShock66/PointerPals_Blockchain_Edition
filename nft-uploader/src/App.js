import logo from "./logo.svg";
import "./App.css";
import { Box, Grid, Card, Button, FormControl, TextField } from "@mui/material";
import { useState } from "react";
import axios from 'axios';

const endpoint = '//localhost:4000'

function App() {

  const [file, setFile] = useState(undefined);
  const [name, setName] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [pubKey, setPubKey]         = useState('');
  const [result, setResult]         = useState(undefined);
   
  return (
    <Grid container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{marginTop: '3rem'}}>
      <Grid item>
        { !result && <Card style={{padding: '2rem'}}>
          <Box sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    '& .MuiButton-root': { m: 1, width: '25ch' },
                  }}>
            <FormControl>
              <TextField label='NFT Name' value={name} onChange={e => setName(e.target.value)}></TextField>
              <TextField label="MetaMask Public Key" value={pubKey} onChange={e => setPubKey(e.target.value)}></TextField>
              <TextField label="MetaMask Private Key" value={privateKey} onChange={e => setPrivateKey(e.target.value)}></TextField>
              <Button variant="contained" component="label">
                {!!file ? file.name : 'Upload NFT File' }
                <input type="file" accept="image/png, image/jpeg, audio/mp3" hidden onChange={e => setFile(e.target.files[0])} />
              </Button>
              <Button variant='contained' type="button" onClick={() => {
                console.log(file.name.split('.')[1]);
                const formData = new FormData();
                formData.append('file', file);
                axios.post(`${endpoint}/nft`, formData, { headers: {
                  "Content-Type": "multipart/form-data",
                  "name": name,
                  "public_key": pubKey,
                  "private_key": privateKey
                }}).then(res => setResult(res.data));
                }}>Submit</Button>
            </FormControl>
          </Box>
        </Card> }
        { result && <Card style={{padding: '2rem'}}>
          <h1>Success!!!!!!!!!!</h1>
          <h3>View your transaction on <a target='_blank' href={`https://goerli.etherscan.io/tx/${result.hash}`} rel="noreferrer">Etherscan</a></h3>
          <Button type='button' onClick={() => {
            setFile(undefined);
            setName('');
            setPubKey('');
            setPrivateKey('');
            setResult(undefined);
          }}>Create another NFT</Button>
        </Card> }
      </Grid>
    </Grid>
  );
}

export default App;
