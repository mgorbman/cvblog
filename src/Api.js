const getPostByURL = (url, callback) => {
    fetch(`${process.env.REACT_APP_X}/posts/` + url)
        .then((response) => response.json())
        .then((x) => callback(x))
}

const getPostList = (callback) => {
    fetch(`${process.env.REACT_APP_X}` + '/blog')
        .then((response) => response.json())
        .then((x) => callback(x))
}

export { getPostByURL, getPostList }
