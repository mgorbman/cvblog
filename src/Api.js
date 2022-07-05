const x = () => {
fetch(`${process.env.REACT_APP_X}/posts/aaa`)
    .then(response => response.json())
    .then(json => console.log(json));
}

export {
    x
}