import { useState } from 'react'
import CommentEditor from './CommentEditor'

export default function MagicalComment({ comment, data, parent, submit }) {
    const [inEdit, setEdit] = useState(false)

    return (
        <div style={{ marginLeft: parent ? '0px' : '25px' }}>
            <span>{comment.name}</span>
            <br />
            <div> {comment._id} </div>
            <br />
            <button
                onClick={() => {
                    setEdit(!inEdit)
                }}
            >
                {inEdit ? 'Close' : 'Reply'}
            </button>
            {inEdit === true && <CommentEditor submit={submit(comment._id)} />}
            <div>
                {data[comment._id] &&
                    data[comment._id].map((c) => {
                        return (
                            <MagicalComment
                                parent={false}
                                comment={c}
                                key={c._id}
                                data={data}
                                submit={submit}
                            />
                        )
                    })}
            </div>
            <br />
        </div>
    )
}
