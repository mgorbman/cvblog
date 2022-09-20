import CommentEditor from './CommentEditor'
import { useState } from 'react'

export default function BlogComment({ comment, submit }) {
    const [inEdit, setEdit] = useState(false)

    return (
        <div>
            <span>Poster: </span>
            <span>{comment.name}</span>
            <br />
            <div> {comment._id} </div>
            <br />
            <span>Date: </span>
            <span> {comment.date} </span>
            <br />
            <span>Content: </span>
            <br />
            <div> {comment.content} </div>
            <button
                onClick={() => {
                    setEdit(!inEdit)
                }}
            >
                {inEdit ? 'Close' : 'Reply'}
            </button>
            {inEdit === true && <CommentEditor submit={submit} />}
            <hr />
        </div>
    )
}
