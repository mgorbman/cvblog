/* eslint-disable import/no-anonymous-default-export */
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { isAdmin } from '../../globalStates'
import CommentEditor from '../../components/CommentEditor'
import parse from 'html-react-parser'
import BlogComment from '../../components/BlogComment'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import PostEditor from '../../components/PostEditor'
import CommentTreeView from '../../components/CommentTreeView'

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

    const queryClient = useQueryClient()

    const { mutate: updatePost } = useMutation(
        (data) =>
            fetch(`${process.env.REACT_APP_BACKEND}/blogposts?isPost=true`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }),
        {
            onSuccess: (_, { content: newContent }) =>
                queryClient.setQueryData(
                    ['getPostData', posturl],
                    (oldPost) => ({ ...oldPost, content: newContent })
                ),
        }
    )

    const { mutate: publishComment } = useMutation(
        (data) =>
            fetch(
                `${process.env.REACT_APP_BACKEND}/blogposts/${posturl}?isPost=false`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            ),
        {
            onSuccess: async (data, variables) => {
                const response = await data.json()
                queryClient.setQueryData(
                    ['getPostComments', posturl],
                    ({ comments }) => {
                        return {
                            comments: [
                                ...comments,
                                {
                                    ...variables,
                                    ...response,
                                },
                            ],
                        }
                    }
                )
            },
        }
    )

    const createComment =
        (respondingTo) =>
        ({ content, name }) => {
            publishComment({
                name,
                content,
                respondingTo,
            })
        }

    // const newCommentsObj = {}

    if (postStatus === 'loading') {
        return <div>Loading data</div>
    }

    return (
        <>
            <Link to="/blog">Back to posts-list</Link>
            <br />
            <h2>Blog</h2>
            {inEdit && (
                <>
                    <PostEditor
                        title={postData.title}
                        content={postData.content}
                        submit={({ content }) => {
                            if (content !== postData.content) {
                                updatePost({
                                    id: postData._id,
                                    content,
                                })
                            }
                            setEdit(false)
                        }}
                        disableEditing={['title']}
                    />
                </>
            )}
            {!inEdit && (
                <>
                    <h3>{postData.title}</h3>
                    <div>{parse(postData.content)}</div>
                    <button onClick={() => setEdit(true)}>Edit Post</button>
                </>
            )}
            <CommentEditor submit={createComment(null)} />

            {
                commentStatus !== 'loading' && (
                    <CommentTreeView comments={commentData.comments} />
                )
                // (() => {
                //     Object.values(commentData.comments).forEach((c) => {
                //         if (c.respondingTo) {
                //             if (!newCommentsObj[c.respondingTo]) {
                //                 newCommentsObj[c.respondingTo] = []
                //             }
                //             newCommentsObj[c.respondingTo].push(c)
                //         }
                //         // console.log(c.respondingTo)
                //     })
                //     console.log(newCommentsObj)
                //     return commentData.comments.map((comment) => (
                //         <BlogComment
                //             key={comment._id}
                //             comment={comment}
                //             submit={createComment(comment._id)}
                //             id={comment._id}
                //         />
                //     ))
                // })()}
            }
        </>
    )
}
