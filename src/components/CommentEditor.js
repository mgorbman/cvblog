import { useState } from 'react'

export default function CommentEditor({ submit }) {
    const [state, setState] = useState({ content: '', name: '' })
    return (
        <div>
            <label>Name:</label> <br />
            <input
                onChange={(event) =>
                    setState({ ...state, name: event.target.value })
                }
                value={state.name}
                type="text"
            />
            <br />
            <label>Content:</label> <br />
            <textarea
                onChange={(event) =>
                    setState({ ...state, content: event.target.value })
                }
                value={state.content}
            ></textarea>
            <button onClick={() => submit(state)}>Submit</button>
        </div>
    )
}
