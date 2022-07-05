import React,{useState} from 'react';

import logo from './logo.svg';
import './App.css';
import Editor from './components/Editor';
import {x} from './Api'
import { BrowserRouter, Route, Router, Routes} from 'react-router-dom';

function App() {
const [state, setState] = useState("<p>Hello from CKEditor 5!</p>")
  return (
  <div> 
    <h1>Editor</h1>
    {/* <Route path='test' element={<h2>test</h2>}/> */}

    <Routes>
      <Route path="/" element={<h2>test</h2>} />
    </Routes>
    
    
    
    
    
  

    <button onClick={x}>Get</button>
    <Editor
    data={state} 
    submit={setState}
    />
    {JSON.stringify(state)}
  </div>)
}

export default App;
