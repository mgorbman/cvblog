import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Homepage from './components/Homepage';
import CV from './components/CV';
import Blog from './components/Blog';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
  <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="CV" element={<CV/>} />
      <Route path="Blog" element={<Blog/>} />
    </Routes>
    <App />
  </BrowserRouter>

    
);

