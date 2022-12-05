import logo from "./logo.svg";
import "./App.css";
import { Button, FormControl } from "@mui/material";
import { useState } from "react";
const fs = require('fs');

function App() {

  const [file, setFile] = useState(undefined);

  return (
    <FormControl>
      <Button variant="contained" component="label">
        Upload File
        <input type="file" hidden onChange={e => setFile(e.target.files[0])} />
      </Button>
      <label htmlFor="name">Name</label>
      <input type="text" id="name"></input>
      <Button variant='contained' type="button" onClick={() => {
        console.log(file);
        window.localStorage.setItem('file', JSON.stringify(file));
        }}>Submit</Button>
    </FormControl>
  );
}

export default App;
