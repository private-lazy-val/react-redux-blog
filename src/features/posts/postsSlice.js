import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector} from '@reduxjs/toolkit';
import axios from 'axios';
import {sub} from "date-fns";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

// NORMALIZING DATA
// createEntityAdapter API provides a standardized way to store your data in a slice by taking a collection of items
// and putting them into the shape of { ids: [], entities: {} }
// createEntityAdapter returns an object that contains a set of generated reducer functions for adding, updating,
// and removing items from an entity state object.
// sortComparer function is used to keep the post IDs array in sorted order
const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

// the adapter object has a getInitialState function that returns an empty {ids: [], entities: { post.id: {post}} normalized state object.
// You can pass in more fields to getInitialState, and those will be merged in
const initialState = postsAdapter.getInitialState({
        // posts: [], don't need with entity adapter
        isLoading: false,
        hasError: false,
        error: null
    }
)

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async () => {
        const response = await axios.get(POSTS_URL);
        if (response.data && response.data.length > 0) {
            return response.data;
        } else {
            throw new Error('Data format is incorrect or array is empty');
        }
    })

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    async (newPost) => {
        const response = await axios.post(POSTS_URL, newPost);
        if (response.data && response.status === 201) {
            return response.data;
        } else {
            throw new Error('Failed to add new post');
        }
    })

export const updatePost = createAsyncThunk('posts/updatePost', async (updatedPost) => {
    const {id} = updatedPost;
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, updatedPost)
        if (response.data && response.status === 200) return response.data;
    } catch (err) {
        return updatedPost; // only for testing Redux!
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const {id} = initialPost;
    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`);
        // Unique to JSON Placeholder API
        if (response.data && response.status === 200) return initialPost;
        return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
        return err.message;
    }
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const {postId, reaction} = action.payload;
            const existingPost = state.entities[postId]; // without entity adapter – state.posts.find(post => post.id === postId);
            if (existingPost) {
                existingPost.reactions[reaction]++;
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                // Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), {minutes: min++}).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                // Add any fetched posts to the array
                postsAdapter.upsertMany(state, loadedPosts);
                // without entity adapter – state.posts = state.posts.concat(loadedPosts);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id
                // would be not be needed if the fake API
                // returned accurate new post IDs instead of always returning 101
                const sortedPosts = state.posts.sort((a, b) => {
                    if (a.id > b.id) return 1;
                    if (a.id < b.id) return -1;
                    return 0;
                })
                action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;

                action.payload.userId = Number(action.payload.userId);
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                postsAdapter.addOne(state, action.payload);
                // without entity adapter – state.posts.push(action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log(action.payload);
                    console.log('Update could not be completed');
                    return;
                }
                action.payload.date = new Date().toISOString();
                postsAdapter.upsertOne(state, action.payload);
                // without entity adapter
                // const {id} = action.payload;
                // const posts = state.posts.filter(post => post.id !== id);
                // state.posts = [...posts, action.payload];
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not be completed');
                    console.log(action.payload);
                    return;
                }
                const {id} = action.payload; // action.payload is initialPost returned by async thunk
                postsAdapter.removeOne(state, id);
                // without entity adapter – state.posts = state.posts.filter(post => post.id !== id);
            })
    }
})


export default postsSlice.reducer;
export const {reactionAdded} = postsSlice.actions;

// || SELECTORS ||

// without adapter
// export const selectPostById = (state, postId) =>
//     state.posts.posts.find(post => post.id === postId);
// export const selectAllPosts = (state) => state.posts.posts;

// The adapter object has a getSelectors function.
// getSelectors creates these 3 selectors, and we rename them with aliases using destructuring
// You can pass in a selector that returns this particular slice of state from the Redux root state,
// and it will generate selectors like selectAll and selectById.
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts);

export const selectPostsIsLoading = (state) => state.posts.isLoading;
export const selectPostsHasError = (state) => state.posts.hasError;
export const selectPostError = (state) => state.posts.error;
export const selectPostsByUser = createSelector(
    // The component will re-render only if selectAllPosts or the anonymous func (userId) changes
    [selectAllPosts, (state, userId) => userId], // dependencies provide input params (below) for the output func
    (posts, userId) => posts.filter(post => post.userId === userId));
