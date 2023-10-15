import {useSelector, useDispatch} from "react-redux";
import {useEffect} from "react";
import {selectAllPosts, selectPostsIsLoading, selectPostsHasError, selectPostError} from "./selector";
import PostsExcerpt from "./PostsExcerpt";
import {fetchPosts} from "./postsSlice";


const PostsList = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);
    const postIsLoading = useSelector(selectPostsIsLoading);
    const postHasError = useSelector(selectPostsHasError);
    const error = useSelector(selectPostError);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);


    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));

    return (
        <section>
            <h2>Posts</h2>
            {postIsLoading ? <p>Loading...</p> : postHasError && !postIsLoading ? <p>{error}</p> :
                orderedPosts.map(post =>
                    <PostsExcerpt key={post.id} post={post}/>)
            }

        </section>
    )
}
export default PostsList