/* eslint-disable import/no-anonymous-default-export */

import Editor from '../../components/Editor'
import { getPostData, pushPost } from '../../Api'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'

export default () => {
    const [state, setState] = useState('')
    const [title, setTitle] = useState('')

    const queryClient = useQueryClient()

    const mutation = useMutation(
        (data) =>
            fetch(`${process.env.REACT_APP_BACKEND}/blogposts?isPost=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }),
        {
            onSuccess: async (data, variables) => {
                const { title, date, url } = await data.json()
                console.log('query debug')
                queryClient.setQueryData('getAllPosts', (postList) => [
                    ...postList,
                    {
                        title,
                        date,
                        url,
                    },
                ])
            },
        }
    )

    const submitPost = () => {
        const post = { title: title, content: state }
        mutation.mutate(post)
    }

    return (
        <div>
            <Link to="/">Back to Homepage</Link>
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
