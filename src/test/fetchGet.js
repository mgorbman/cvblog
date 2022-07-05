fetch('localhost:3000/posts/aaa')
    .then(response => response.json())
    .then(json => console.log(json));