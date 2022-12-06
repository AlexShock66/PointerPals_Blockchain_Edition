import logo from "./logo.svg";
import "./App.css";
import { Button, FormControl } from "@mui/material";
import { useState } from "react";
import axios from 'axios';

const endpoint = '//localhost:4000'

function App() {

  const [file, setFile] = useState(undefined);
  // 
  return (
    <FormControl>
      <Button variant="contained" component="label">
        Upload File
        <input type="file" hidden onChange={e => setFile(e.target.files[0])} />
      </Button>
      <label htmlFor="name">Name</label>
      <input type="text" id="name"></input>
      <Button variant='contained' type="button" onClick={() => {
        console.log(file.name.split('.')[1]);
        const filename = `../public/data.${file.name.split('.')[1]}`;
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`${endpoint}/nft`, formData, { headers: {
          "Content-Type":"multipart/form-data"
        }})
        }}>Submit</Button>
    </FormControl>
  );
}

export default App;
