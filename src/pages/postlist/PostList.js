/* eslint-disable import/no-anonymous-default-export */
import { getPostList } from '../../Api'
import PostListEntry from '../../components/PostListEntry'
import { useState } from 'react'

export default () => {
    const [state, setState] = useState(null)

    if (state == null) {
        getPostList(setState)
        return <div>Loading data</div>
    }
    // console.log(state)
    return (
        <>
            <h2>Post List</h2>
            {state.map(({ title, url, date }) => (
                <PostListEntry key={url} title={title} url={url} date={date} />
            ))}
        </>
    )
}
