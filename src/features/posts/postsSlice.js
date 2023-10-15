import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {sub} from "date-fns";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const initialState = {
    posts: [],
    isLoading: false,
    hasError: false,
    error: null
}

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
    async (initialPost) => {
        console.log(initialPost)
        const response = await axios.post(POSTS_URL, initialPost);
        if (response.data && response.status === 201) {
            return response.data;
        } else {
            throw new Error('Failed to add new post');
        }
    })

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const {postId, reaction} = action.payload;
            const existingPost = state.posts.find(post => post.id === postId);
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
                state.posts = state.posts.concat(loadedPosts);
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
            // returned accurate new post IDs
            const sortedPosts = state.posts.sort((a, b) => {
                if (a.id > b.id) return 1;
                if (a.id < b.id) return -1;
                return 0;
            })
            action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
            // End fix for fake API post IDs

            action.payload.userId = Number(action.payload.userId);
            action.payload.date = new Date().toISOString();
            action.payload.reactions = {
                thumbsUp: 0,
                wow: 0,
                heart: 0,
                rocket: 0,
                coffee: 0
            }
            state.posts.push(action.payload);
        })
    }
})


export default postsSlice.reducer;
export const {reactionAdded} = postsSlice.actions;