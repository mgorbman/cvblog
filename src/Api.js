const getPostByURL = (url, callback) => {
    fetch(`${process.env.REACT_APP_X}/posts/${url}`)
        .then((response) => response.json())
        .then((x) => callback(x))
}

const getPostList = (callback) => {
    fetch(`${process.env.REACT_APP_X}/blog`)
        .then((response) => response.json())
        .then((x) => callback(x))
}

const pushPost = (data, callback) => {
    fetch(`${process.env.REACT_APP_X}/pushPost`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((x) => callback(x))
}

export { getPostByURL, getPostList, pushPost }
