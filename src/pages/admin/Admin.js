import Editor from '../../components/Editor'
import PostListEntry from '../../components/PostListEntry'
import { getPostByURL, pushPost } from '../../Api'
import { useState } from 'react'

export default () => {
    const [state, setState] = useState('')
    const [title, setTitle] = useState('')
    const submitPost = () => {
        const post = { title: title, content: state }
        pushPost(post, console.log)
    }

    return (
        <div>
            <h2>Admin Page</h2>
            <Editor data={null} submit={setState} />
            <button onClick={submitPost}>Submit Post</button>
            <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />
            {JSON.stringify(title)}
        </div>
    )
}
