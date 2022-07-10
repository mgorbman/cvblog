import { useParams } from 'react-router-dom'
import { getPostByURL } from '../Api'

export default (props) => {
    const { title } = useParams()
    getPostByURL(title)
    return <h2>Blog</h2>
}
