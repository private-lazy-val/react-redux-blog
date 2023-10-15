import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {addNewPost} from "./postsSlice";
import {selectAllUsers} from "../users/selector";

const AddPostForm = () => {
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [isRequesting, setIsRequesting] = useState(false);

    const users = useSelector(selectAllUsers);

    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const onAuthorChanged = e => setUserId(e.target.value);

    const canSave = [title, content, userId].every(Boolean) && isRequesting === false;
    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                setIsRequesting(true);
                // When you dispatch an async thunk, it returns a promise that resolves into
                // a SerializedError object if the thunk gets rejected, and resolves into the result of the payloadCreator function
                // if the thunk is fulfilled.
                // However, working with these outcomes directly could be somewhat verbose,
                // which is where unwrapResult and thunkApi.unwrap come into play.
                await dispatch(addNewPost({title, body: content, userId})).unwrap();

                setTitle('');
                setContent('');
                setUserId('');
            } catch (err) {
                console.log('Failed to save the post', err);
            } finally {
                setIsRequesting(false);
            }
        }
    }

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post
                </button>
            </form>
        </section>
    );
};

export default AddPostForm;