import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import {Link} from 'react-router-dom';
import {selectPostById} from "./postsSlice";
import {useSelector} from "react-redux";

const PostsExcerpt = ({postId}) => {
    const post = useSelector(state => selectPostById(state, postId));

    return (
        <article>
            <h4>{post.title}</h4>
            <p>{post.body.substring(0, 75)}</p>
            <p className="postCredit">
                <Link to={`post/${post.id}`}>View Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    );
};

export default PostsExcerpt;