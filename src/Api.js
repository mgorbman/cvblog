function getPostByURL(url, callback) {
    getPostData(url, 'ignoreComments=true', callback)
}

function getCommentsByPostURL(url, callback) {
    getPostData(url, 'commentsOnly=true', callback)
}

async function getPostData(url, queryString, callback) {
    const response = await fetch(
        `${process.env.REACT_APP_X}/blogposts/${url}?${queryString}`
    )
    callback(await response.json())
}

async function getPostList(callback) {
    const response = await fetch(`${process.env.REACT_APP_X}/blogposts`)
    callback(await response.json())
}

function pushPost({ title, content }, callback) {
    pushData({ title, content }, 'isPost=true', callback, '')
}

function pushComment({ name, content, url, respondingTo }, callback) {
    pushData({ name, content, respondingTo }, 'isPost=false', callback, url)
}

async function pushData(data, queryString, callback, url) {
    const response = await fetch(
        `${process.env.REACT_APP_X}/blogposts${
            url === '' ? '' : '/' + url
        }?${queryString}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    callback(await response.json())
}

async function updatePost(data, callback) {
    const response = await fetch(`${process.env.REACT_APP_X}/blogposts`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    callback(await response.json())
}

export {
    getPostByURL,
    getPostList,
    getCommentsByPostURL,
    getPostData,
    pushComment,
    pushPost,
    pushData,
    updatePost,
}
