/* eslint-disable import/no-anonymous-default-export */

export default ({ title, url, date }) => {
    return (
        <div>
            <div>
                <a href={`/blog/${url}`}>{title}</a>
            </div>
            <div>Publish Date {date}</div>
        </div>
    )
}
