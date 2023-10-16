import {useSelector} from "react-redux";
import {selectPostIds, selectPostsIsLoading, selectPostsHasError, selectPostError} from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostsList = () => {
    const orderedPostIds = useSelector(selectPostIds);
    const postIsLoading = useSelector(selectPostsIsLoading);
    const postHasError = useSelector(selectPostsHasError);
    const error = useSelector(selectPostError);

    return (
        <section>
            {postIsLoading ? <p>Loading...</p> : postHasError && !postIsLoading ? <p>{error}</p> :
                orderedPostIds.map(postId =>
                    <PostsExcerpt key={postId} postId={postId}/>)
            }
        </section>
    )
}
export default PostsList