/* eslint-disable import/no-anonymous-default-export */
import { Link } from 'react-router-dom'

export default ({ title, url, date }) => {
    return (
        <div>
            <div>
                <Link to={`/blog/${url}`}>{title}</Link>
            </div>
            <div>Publish Date {date}</div>
        </div>
    )
}
