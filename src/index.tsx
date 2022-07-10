import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import CV from './components/CV'
import Blog from './components/Blog'
import PostList from './components/PostList'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="cv" element={<CV />} />
            <Route path="blog" element={<PostList />} />
            <Route path="blog/:title" element={<Blog />} />
        </Routes>
        <App />
    </BrowserRouter>
)
