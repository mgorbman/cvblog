import Editor from './Editor.js'
import parse from 'html-react-parser'
import { useEffect, useReducer } from 'react'

const pageLayout = {
    width: '80%',
    backgroundColor: 'yellow',
}
const titleStyling = {
    backgroundColor: 'lime',
}
const flagFlipper = (flag) => !flag
const stateReducer = (state, data) => {
    return { ...state, ...data }
}

export default function PostEditor({ content, title, submit, disableEditing }) {
    const [inPreview, flipInPreview] = useReducer(flagFlipper, false)
    const [state, setState] = useReducer(stateReducer, {
        title: title === undefined ? '' : title,
        content: content === undefined ? '' : content,
    })
    useEffect(() => {
        setState({ content, title })
    }, [content, title])

    return (
        <div style={pageLayout}>
            {!inPreview && (
                <>
                    <div>
                        <span style={titleStyling}>Post Title: </span>
                        {!(
                            Array.isArray(disableEditing) &&
                            disableEditing.includes('title')
                        ) && (
                            <input
                                type="text"
                                value={state.title}
                                onChange={(event) =>
                                    setState({ title: event.target.value })
                                }
                            />
                        )}
                        {Array.isArray(disableEditing) &&
                            disableEditing.includes('title') && (
                                <span>{state.title}</span>
                            )}
                    </div>
                    <div>
                        <Editor
                            key={new Date().toISOString()}
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
                    <button
                        onClick={() => {
                            submit(state)
                            flipInPreview()
                        }}
                    >
                        Submit Post
                    </button>
                </div>
            )}
        </div>
    )
}
