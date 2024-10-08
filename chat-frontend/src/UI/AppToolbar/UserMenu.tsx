import React from 'react';
import {  Button, Grid, Typography } from '@mui/material';
import { User } from '../../types';
import { logout } from '../../features/users/usersThunks';
import { useAppDispatch } from '../../app/hooks';
import {  useNavigate } from 'react-router-dom';

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/');
    };

    return (
        <Grid container alignItems="center" spacing={2} direction="row">
            <Grid item>
                <Typography color="inherit">
                    Welcome, {user.displayName ? user.displayName : user.username}!
                </Typography>
            </Grid>
            <Grid item>
                <Button onClick={handleLogout} color="inherit">
                    Logout
                </Button>
            </Grid>
        </Grid>
    );
};

export default UserMenu;