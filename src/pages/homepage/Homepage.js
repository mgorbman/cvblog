/* eslint-disable import/no-anonymous-default-export */
import { Link } from 'react-router-dom'

export default () => {
    return (
        <>
            <h2>Homepage</h2>
            Welcome to my blog.
            <br />
            <Link to="/blog">Blog</Link>
            <br />
            <Link to="/cv">CV</Link>
            <br />
            <Link to="/admin">Admin</Link>
            <br />
            <br />
            <Link to="/login">Login</Link>
        </>
    )
}
