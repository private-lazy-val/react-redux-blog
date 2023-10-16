import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";
import SinglePostPage from "./features/posts/SinglePostPage";
import EditPostForm from "./features/posts/EditPostForm";
import Layout from "./components/Layout";
import UserPage from "./features/users/UserPage";
import UsersList from "./features/users/UsersList";
import {Routes, Route, Navigate} from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>

                <Route index element={<PostsList/>}/>

                <Route path="post">
                    <Route index element={<AddPostForm/>}/>
                    <Route path=":postId" element={<SinglePostPage/>}/>
                    <Route path="edit/:postId" element={<EditPostForm />} />
                </Route>

                <Route path="user">
                    <Route index element={<UsersList/>}></Route>
                    <Route path=":userId" element={<UserPage/>}></Route>
                </Route>

                {/*Catch all*/}
                {/*With 'replace' the current history entry is replaced by the new one, */}
                {/*so the back button will take you to the page before the last one*/}
                <Route path="*" element={<Navigate to="/" replace/>}></Route>

            </Route>
        </Routes>
    );
}

export default App;
