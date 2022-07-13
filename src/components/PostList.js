/* eslint-disable import/no-anonymous-default-export */
import { getPostList } from '../Api'
import { useState } from 'react'

export default () => {
    const [state, setState] = useState(null)

    if (state == null) {
        getPostList(setState)
        return <div>Loading data</div>
    }
    return (
        <>
            <h2>Post List</h2>
            {Object.values(state).map((post) => (
                <div>
                    {post.title}
                    {post.date}
                </div>
            ))}
        </>
    )
}
