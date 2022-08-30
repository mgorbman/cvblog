/* eslint-disable import/no-anonymous-default-export */
import { getPostList } from '../../Api'
import PostListEntry from '../../components/PostListEntry'
import { useState } from 'react'
import { useQuery } from 'react-query'

export default () => {
    // const [state, setState] = useState(null)

    // if (state == null) {
    //     getPostList(setState)
    //     return <div>Loading data</div>
    // }

    async function getAllPosts() {
        const response = await fetch(`${process.env.REACT_APP_X}/blogposts`)
        return response.json()
    }

    const { data, status } = useQuery('keyTest', getAllPosts, {
        staleTime: 120000,
    })

    if (status === 'loading') {
        return <div>Loading data</div>
    }
    return (
        <>
            <h2>Post List</h2>
            {data.map(({ title, url, date }) => (
                <PostListEntry key={url} title={title} url={url} date={date} />
            ))}
        </>
    )
}
