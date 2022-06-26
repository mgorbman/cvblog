import React,{useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from './components/Editor';

function App() {
const [state, setState] = useState("<p>Hello from CKEditor 5!</p>")
  return (<div> 
    <Editor
    data={state} 
    submit={setState}
    />
    {JSON.stringify(state)}
  </div>)
}

export default App;
