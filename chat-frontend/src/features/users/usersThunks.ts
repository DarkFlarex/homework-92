import {createAsyncThunk} from "@reduxjs/toolkit";
import {GlobalError, LoginMutation, RegisterMutation, User, ValidationError} from "../../types";
import axiosApi from "../../axiosApi";
import {isAxiosError} from "axios";
import {RootState} from "../../app/store";
import {unsetUser} from "./usersSlice";

export const register = createAsyncThunk<User, RegisterMutation, { rejectValue: ValidationError }>(
    'users/register',
    async (registerMutation, { rejectWithValue }) => {
        try {
            const { data: user } = await axiosApi.post<User>('/users', registerMutation);
            return user;
        } catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data);
            }

            throw e;
        }
    },
);

export const login = createAsyncThunk<User, LoginMutation, { rejectValue: GlobalError, state: RootState }>(
    'users/login',
    async (loginMutation, { rejectWithValue }) => {
        try {
            const { data: user } = await axiosApi.post<User>('/users/sessions', loginMutation);
            return user;
        } catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data);
            }
            throw e;
        }
    }
);

export const logout = createAsyncThunk(
    'users/logout',
    async (_arg, {dispatch }) => {
        await axiosApi.delete('/users/sessions');
        dispatch(unsetUser());
    },
);