import {createSlice, createAsyncThunk,  createEntityAdapter} from "@reduxjs/toolkit";
import axios from "axios";

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState();

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        const response = await axios.get(USERS_URL);
        if (response.data && response.data.length > 0) {
            return response.data;
        } else {
            throw new Error('Data format is incorrect or array is empty');
        }
    })

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(
                fetchUsers.fulfilled, (state, action) => {
                    usersAdapter.setAll(state, action.payload);
                }
            )
    }
})

export default usersSlice.reducer;

// || SELECTORS ||

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById } =
    usersAdapter.getSelectors(state => state.users);

// without adapter
// export const selectAllUsers = (state) => state.users;
// export const selectUserById = (state, userId) => state.users.find(user => user.id === userId);