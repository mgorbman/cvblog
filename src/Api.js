async function getPostByURL(url, callback) {
    const response = await fetch(`${process.env.REACT_APP_X}/posts/${url}`)
    callback(await response.json())
}

// const getPostList = (callback) => {
//     fetch(`${process.env.REACT_APP_X}/blog`)
//         .then((response) => response.json())
//         .then((x) => callback(x))
// }

async function getPostList(callback) {
    const response = await fetch(`${process.env.REACT_APP_X}/blog`)
    callback(await response.json())
}

// const pushPost = (data, callback) => {
//     fetch(`${process.env.REACT_APP_X}/pushPost`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//         .then((response) => response.json())
//         .then((x) => callback(x))
// }

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
