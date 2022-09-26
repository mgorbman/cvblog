/* eslint-disable import/no-anonymous-default-export */

import Editor from '../../components/Editor'
import { getPostData, pushPost } from '../../Api'
import { useEffect, useReducer, useState } from 'react'
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
                body: JSON.stringify(data),
                credentials: 'include',
            }),
        {
            onSuccess: async (data, { title }) => {
                setPostState({ title: '', content: '' })
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
        setPostState(postData)
        mutation.mutate(postData)
    }

    return (
        <div>
            <Link to="/">Back to Homepage</Link>
            <h2>Admin Page</h2>
            <PostEditor
                title={postState.title}
                content={postState.content}
                submit={submitPost}
            />
        </div>
    )
}
