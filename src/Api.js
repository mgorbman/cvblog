async function getPostByURL(url, callback) {
    const response = await fetch(`${process.env.REACT_APP_X}/posts/${url}`)
    callback(await response.json())
}

async function getPostList(callback) {
    const response = await fetch(`${process.env.REACT_APP_X}/blog`)
    callback(await response.json())
}

async function pushPost(data, callback) {
    const response = await fetch(`${process.env.REACT_APP_X}/pushPost`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    callback(await response.json())
}

export { getPostByURL, getPostList, pushPost }
