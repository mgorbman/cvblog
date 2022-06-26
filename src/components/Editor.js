import { useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import { config } from './editorConfig'

  export default function Editor({
    data, submit
  }) {
    const [body, setBody] = useState(typeof data === 'string'? data: '')

    return (
      <div className="App">
        <div className="Editor">
            <CKEditor
              editor={ClassicEditor}
              data={body}
              // config={config}
              onChange={(event, editor) => {
                const data = editor.getData()
                setBody(data)
              }}
            />
            <button onClick={() => submit(body)}>Submit</button>
        </div>
      </div>
    )
  }
