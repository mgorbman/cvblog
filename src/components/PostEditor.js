import Editor from './Editor.js'
import parse from 'html-react-parser'
import { useReducer } from 'react'

const pageLayout = {
    width: '80%',
    backgroundColor: 'yellow',
}
const titleStyling = {
    backgroundColor: 'lime',
}
const flagFlipper = (flag) => !flag
const stateReducer = (state, data) => {
    if ('title' in data) return { content: state.content, title: data.title }
    else return { title: state.title, content: data.content }
}

export default function PostEditor({ content, title, submit }) {
    const [inPreview, flipInPreview] = useReducer(flagFlipper, false)
    const [state, setState] = useReducer(stateReducer, {
        title: title === undefined ? '' : title,
        content: content === undefined ? '' : content,
    })
    return (
        <div style={pageLayout}>
            {!inPreview && (
                <>
                    <div>
                        <span style={titleStyling}>Post Title: </span>
                        <input
                            type="text"
                            value={state.title}
                            onChange={(event) =>
                                setState({ title: event.target.value })
                            }
                        />
                    </div>
                    <div>
                        <Editor
                            data={state.content}
                            submit={(contentString) => {
                                setState({ content: contentString })
                                flipInPreview()
                            }}
                            submitText="Preview"
                        />
                    </div>
                </>
            )}
            {inPreview && (
                <div>
                    <h1>{state.title}</h1>
                    {parse(state.content)}
                    <button onClick={flipInPreview}>Resume Editing</button>
                    <button onClick={() => submit(state)}>Submit Post</button>
                </div>
            )}
        </div>
    )
}
