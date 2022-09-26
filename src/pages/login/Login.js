/* eslint-disable import/no-anonymous-default-export */
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getAuthorization } from '../../Api'

async function login(credentials) {
    const response = await fetch(`${process.env.REACT_APP_X}/login`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(credentials),
    })
    console.log(response)
}

const x = (credentials, callback) => () => login(credentials, callback)

export default () => {
    return (
        <>
            <h2>Login</h2>
            <div>
                <label>Username</label>
                <input type="text" id="name" name="name" required></input>
            </div>
            <div>
                <label>Password</label>
                <input
                    type="text"
                    id="password"
                    name="password"
                    required
                ></input>
            </div>
            <button
                onClick={x({ user: 'user', password: 'password' }, console.log)}
                // onClick={() => login({ user: 'user', password: 'password' })}
            >
                Submit
            </button>
            <br />
            <Link to="/">Homepage</Link>
        </>
    )
}
