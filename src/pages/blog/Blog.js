/* eslint-disable import/no-anonymous-default-export */
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import {
    getPostByURL,
    updatePost,
    getCommentsByPostURL,
    pushComment,
    getPostData,
} from '../../Api'
import { useState } from 'react'
import { isAdmin } from '../../globalStates'
import CommentEditor from '../../components/CommentEditor'
import parse from 'html-react-parser'
import Editor from '../../components/Editor'
import BlogComment from '../../components/BlogComment'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import PostEditor from '../../components/PostEditor'

export default (props) => {
    const [inEdit, setEdit] = useState(false)
    const [wasEdited, setWasEdited] = useState(false)
    const { posturl } = useParams()

    function getPost(queryString) {
        return async () => {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND}/blogposts/${posturl}?${queryString}`
            )
            return response.json()
        }
    }

    const { data: postData, status: postStatus } = useQuery(
        ['getPostData', posturl],
        getPost('ignoreComments=true'),
        {
            staleTime: 120000,
        }
    )

    const { data: commentData, status: commentStatus } = useQuery(
        ['getPostComments', posturl],
        getPost('commentsOnly=true'),
        {
            staleTime: 120000,
        }
    )

    // const { data, status } = useQuery('updateData', updateData, {
    //     staleTime: 120000,
    // })

    async function updateData(data) {
        const response = await fetch(`${process.env.REACT_APP_X}/blogposts`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return response.json()
    }

    // const editPost = () => {
    //     const updatedPost = { id: postData._id, content: postData.content }
    //     updatePost(updatedPost, console.log)
    // }

    const queryClient = useQueryClient()

    const mutation = useMutation(
        (data) =>
            fetch(`${process.env.REACT_APP_BACKEND}/blogposts?isPost=true`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }),
        {
            onSuccess: async (data, { title }) => {
                // setPostState({ title: '', content: '' })
                const { content } = await data.json()

                // if (queryClient.getQueryData('getPostData')) {
                //     console.log('test')
                queryClient.setQueryData('getPostData', (post) => {
                    console.log(queryClient.getQueriesData('getPostData'))
                    post[0][1].content = content
                    return post
                })
            },
        }
        // }
    )

    const replyToComment =
        (commentID) =>
        ({ content, name }) => {
            pushComment(
                { content, name, url: posturl, respondingTo: commentID },
                console.log
            )
        }

    if (postStatus === 'loading') {
        return <div>Loading data</div>
    }
    return (
        <>
            <Link to="/blog">Back to posts-list</Link>
            <br />
            <h2>Blog</h2>
            {JSON.stringify(postData)}
            <div>{parse(postData.content)}</div>
            <CommentEditor submit={replyToComment(null)} />

            {commentStatus !== 'loading' &&
                commentData.comments.map((comment) => (
                    <BlogComment
                        key={comment._id}
                        comment={comment}
                        submit={replyToComment(comment._id)}
                    />
                ))}
            {inEdit === true && (
                <>
                    <PostEditor
                        title={postData.title}
                        content={postData.content}
                        submit={(htmlString) => {
                            // console.log(htmlString)
                            mutation.mutate({
                                id: postData._id,
                                content: htmlString.content,
                            })
                        }}
                        editable={{ title: false, content: true }}
                    />
                </>
            )}
            {inEdit === false && isAdmin === true && (
                <>
                    <button onClick={() => setEdit(true)}>Edit Post</button>
                    <button
                        onClick={() => {
                            setWasEdited(false)
                        }}
                    >
                        Submit Edit
                    </button>
                </>
            )}
        </>
    )
}
