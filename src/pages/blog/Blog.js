/* eslint-disable import/no-anonymous-default-export */
import { useParams } from 'react-router-dom'
import {
    getPostByURL,
    updatePost,
    getCommentsByPostURL,
    pushComment,
} from '../../Api'
import { useState } from 'react'
import { isAdmin } from '../../globalStates'
import CommentEditor from '../../components/CommentEditor'
import parse from 'html-react-parser'
import Editor from '../../components/Editor'
import BlogComment from '../../components/BlogComment'

export default (props) => {
    const [state, setState] = useState(null)
    const [inEdit, setEdit] = useState(false)

    // Takes the dynamic url from index.tsx
    const { title } = useParams()

    const editPost = () => {
        const updatedPost = { id: state._id, content: state.content }
        updatePost(updatedPost, console.log)
    }

    const submitFullCommentData = ({ content, name }) => {
        pushComment(
            { content, name, url: title, respondingTo: null },
            console.log
        )
    }

    const replyToComment =
        (commentID) =>
        ({ content, name }) => {
            pushComment(
                { content, name, url: title, respondingTo: commentID },
                console.log
            )
        }

    //This conditional is a naive solution (assuming a single render)
    if (state == null) {
        getPostByURL(title, setState)
        return <div>Loading data</div>
    }
    if (state != null && !('comments' in state)) {
        getCommentsByPostURL(title, ({ comments }) =>
            setState({ ...state, comments })
        )
    }
    return (
        <>
            <h2>Blog</h2>
            {JSON.stringify(state)}
            <div>{parse(state.content)}</div>
            <CommentEditor submit={submitFullCommentData} />

            {state.comments &&
                state.comments.map((comment) => (
                    <BlogComment
                        key={comment._id}
                        comment={comment}
                        submit={replyToComment(comment._id)}
                    />
                ))}
            {inEdit === true && (
                <>
                    <Editor
                        data={state.content}
                        submit={(htmlString) => {
                            setState({
                                ...state,
                                content: htmlString,
                            })
                            setEdit(false)
                        }}
                    />
                    <input
                        type="text"
                        value={state.title}
                        onChange={(event) =>
                            setState({
                                ...state,
                                title: event.target.value,
                            })
                        }
                    />
                </>
            )}
            {inEdit === false && isAdmin === true && (
                <>
                    <button onClick={() => setEdit(true)}>Edit Post</button>
                    <button onClick={editPost}>Submit Edit</button>
                </>
            )}
        </>
    )
}
