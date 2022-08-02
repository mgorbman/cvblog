/* eslint-disable import/no-anonymous-default-export */
import { useParams } from 'react-router-dom'
import { getPostByURL, pushPost } from '../Api'
import { useState } from 'react'
import parse from 'html-react-parser'

export default (props) => {
    const [state, setState] = useState(null)

    // Testing pushPost
    // pushPost({ title: 'test', content: 'This is a test post' }, console.log)

    // Takes the dynamic url from index.tsx
    const { title } = useParams()
    // const x = useParams()
    // const title = x.title

    //This conditional is a naive solution (assuming a single render)
    if (state == null) {
        getPostByURL(title, setState)
        return <div>Loading data</div>
    }
    return (
        <>
            <h2>Blog</h2>
            {JSON.stringify(state)}
            <div>{parse(state.content)}</div>
        </>
    )
}
