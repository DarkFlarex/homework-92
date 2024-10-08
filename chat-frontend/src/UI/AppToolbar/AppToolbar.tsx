import {AppBar, Container, Grid, styled, Toolbar, Typography} from '@mui/material';
import {Link} from 'react-router-dom';
import {selectUser} from "../../features/users/usersSlice";
import {useAppSelector} from "../../app/hooks";
import AnonymousMenu from "./AnonymousMenu";
import UserMenu from "./UserMenu";

const StyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
      <AppBar position="sticky" sx={{ mb: 2 }}>
        <Toolbar>
          <Container maxWidth="xl">

            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h6" component="div">
                  <StyledLink to="/">Chat</StyledLink>
                </Typography>
              </Grid>

              <Grid item>
                <Grid container alignItems="center" spacing={2} direction="row">
                  <Grid item>
                    {user ? <UserMenu user={user} /> : <AnonymousMenu />}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

          </Container>
        </Toolbar>
      </AppBar>
  );
};

export default AppToolbar;