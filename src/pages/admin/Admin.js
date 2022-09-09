/* eslint-disable import/no-anonymous-default-export */

import Editor from '../../components/Editor'
import { getPostData, pushPost } from '../../Api'
import { useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import PostEditor from '../../components/PostEditor'

export default () => {
    const [postState, setPostState] = useState({
        title: '',
        content: '',
    })

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
            onSuccess: async (data, { title }) => {
                const { date, url } = await data.json()
                if (queryClient.getQueryData('getAllPosts'))
                    queryClient.setQueryData('getAllPosts', (postList) => [
                        ...postList,
                        { title, date, url },
                    ])
            },
        }
    )

    const submitPost = (postData) => {
        setPostState({ title: '', content: '' })
        mutation.mutate(postData)
    }

    return (
        <div>
            <Link to="/">Back to Homepage</Link>
            <h2>Admin Page</h2>
            <PostEditor
                key={new Date().toISOString()}
                title={postState.title}
                content={postState.content}
                submit={submitPost}
            />
        </div>
    )
}
