import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../users/usersSlice";

const PostAuthor = ({userId}) => {

    const { user: author } = useGetUsersQuery('getUsers', {
        selectFromResult: ({ data, isLoading }) => ({
            user: data?.entities[userId]
        }),
    })

    return (
        <span><span className="by">by</span>
            {author ? <Link to={`/user/${userId}`}>{author.name}</Link>
            : 'Unknown author'}
        </span>
    )
}

export default PostAuthor;