const getPostByURL = (url) => {
fetch(`${process.env.REACT_APP_X}/posts/` + url)
    .then(response => response.json())
    .then(json => console.log(json));
}

export {
    getPostByURL
}