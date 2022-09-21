import MagicalComment from './MagicalComment'

export default function CommentTreeView({ comments, submit }) {
    const magicalComments = {}

    comments.forEach((c) => {
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
                        submit={submit}
                    />
                ))}
        </div>
    )
}
