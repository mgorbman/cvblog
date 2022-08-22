import CommentEditor from './CommentEditor'
import { useState } from 'react'
import { pushComment } from '../Api'
export default function BlogComment({ comment, submit }) {
    const [inEdit, setEdit] = useState(false)

    return (
        <div>
            <label>Poster</label>
            <br />
            <input value={comment.name} onChange={() => {}} />
            <br />
            <label>Date</label>
            <br />
            <input value={comment.date} onChange={() => {}} />
            <br />
            <label>Content</label>
            <br />
            <textarea value={comment.content} onChange={() => {}}></textarea>
            <br />
            <button
                onClick={() => {
                    setEdit(!inEdit)
                }}
            >
                {inEdit ? 'Close' : 'Reply'}
            </button>
            {inEdit === true && <CommentEditor submit={submit} />}
        </div>
    )
}
