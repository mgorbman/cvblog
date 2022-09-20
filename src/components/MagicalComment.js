export default function MagicalComment({ comment, data, parent }) {
    const margin = parent ? 0 : 25
    return (
        <div style={{ marginLeft: margin }}>
            <span>{comment.name}</span>
            <br />
            <div> {comment._id} </div>
            <br />
            <div>
                {data[comment._id] &&
                    data[comment._id].map((c) => {
                        return (
                            <MagicalComment
                                parent={false}
                                comment={c}
                                key={c._id}
                                data={data}
                            />
                        )
                    })}
            </div>
            <br />
        </div>
    )
}
