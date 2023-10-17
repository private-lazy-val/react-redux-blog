import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import {Link} from 'react-router-dom';
import { useGetPostsQuery } from './postsSlice';
import {memo} from "react";

const PostsExcerpt = memo(({postId}) => {
    const { post } = useGetPostsQuery('getPosts', {
        selectFromResult: ({ data }) => ({
            post: data?.entities[postId]
        }),
    })

    return (
        <article>
            <h2>{post.title}</h2>
            <p>{post.body.substring(0, 75)}...</p>
            <p className="postCredit">
                <Link to={`post/${post.id}`}>View Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    );
});

export default PostsExcerpt;