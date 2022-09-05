import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './pages/homepage/Homepage'
import { Admin, CV } from './pages'
import Blog from './pages/blog/Blog'
import PostList from './pages/postlist/PostList'
import { QueryClientProvider, QueryClient } from 'react-query'

// import { useMachine } from '@xstate/react'
// import { toggleMachine } from '../path/to/toggleMachine'

// function Toggle() {
//     const [current, send] = useMachine(toggleMachine)

//     return (
//         <button onClick={() => send('TOGGLE')}>
//             {current.matches('inactive') ? 'Off' : 'On'}
//         </button>
//     )
// }
const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="cv" element={<CV />} />
                <Route path="blog" element={<PostList />} />
                <Route path="blog/:posturl" element={<Blog />} />
                <Route path="admin" element={<Admin />} />
            </Routes>
            <App />
        </BrowserRouter>
    </QueryClientProvider>
)
