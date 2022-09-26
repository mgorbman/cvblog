import MagicalComment from './MagicalComment'

export default function CommentTreeView({
    comments: unsortedComments,
    submit,
}) {
    const magicalComments = {}
    const comments = [...unsortedComments]
    // comments.sort((a, b) => (a > b ? +1 : -1))
    // console.log(comments)

    comments.forEach((c) => {
        if (c.respondingTo) {
            if (!magicalComments[c.respondingTo]) {
                magicalComments[c.respondingTo] = []
            }
            magicalComments[c.respondingTo].push(c)
        } else magicalComments[c._id] = []
    })

    return (
        <div>
            {comments
                .filter((c) => !c.respondingTo)
                // .sort(
                //     (comment_a, comment_b) =>
                //         new Date(comment_a.date) - new Date(comment_b.date)
                // )
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
