import MagicalComment from './MagicalComment'

export default function CommentTreeView({ comments }) {
    const magicalComments = {}

    Object.values(comments).forEach((c) => {
        if (c.respondingTo) {
            if (!magicalComments[c.respondingTo]) {
                magicalComments[c.respondingTo] = []
            }
            magicalComments[c.respondingTo].push(c)
        } else magicalComments[c._id] = []
    })

    console.log(magicalComments)

    return (
        <div>
            {comments
                .filter((c) => !c.respondingTo)
                .map((c) => (
                    <MagicalComment
                        parent={true}
                        comment={c}
                        key={c._id}
                        data={magicalComments}
                    />
                ))}
        </div>
    )
}
