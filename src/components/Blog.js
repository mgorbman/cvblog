/* eslint-disable import/no-anonymous-default-export */
import { useParams } from 'react-router-dom'
import { getPostByURL } from '../Api'
import { useState } from 'react'

export default (props) => {
    const [state, setState] = useState(null)
    const { title } = useParams()
    if (state == null) {
        getPostByURL(title, setState)
    }
    return (
        <>
            <h2>Blog</h2>
            {JSON.stringify(state)}
        </>
    )
}
