import logo from "./logo.svg";
import "./App.css";
import { Grid, Card, Button, FormControl } from "@mui/material";
import { useState } from "react";
import axios from 'axios';

const endpoint = '//localhost:4000'

function App() {

  const [file, setFile] = useState(undefined);
  const [name, setName] = useState('');
  // 
  return (
    <Grid container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center">
      <Grid item>
        <Card style={{padding: '2rem'}}>
          <FormControl>
            <Button variant="contained" component="label">
              Upload File
              <input type="file" accept="image/png, image/jpeg, audio/mp3" hidden onChange={e => setFile(e.target.files[0])} />
            </Button>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)}></input>
            <Button variant='contained' type="button" onClick={() => {
              console.log(file.name.split('.')[1]);
              const formData = new FormData();
              formData.append('file', file);
              axios.post(`${endpoint}/nft`, formData, { headers: {
                "Content-Type": "multipart/form-data",
                "name": name
              }})
              }}>Submit</Button>
          </FormControl>
        </Card>
      </Grid>
    </Grid>
  );
}

export default App;
