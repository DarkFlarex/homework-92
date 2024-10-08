import { Button, Grid } from '@mui/material';
import { NavLink } from 'react-router-dom';

const AnonymousMenu = () => {
  return (
      <Grid container spacing={2} alignItems="center">
          <Grid item>
              <Button component={NavLink} to="/register" color="inherit">
                  Register
              </Button>
          </Grid>
          <Grid item>
              <Button component={NavLink} to="/login" color="inherit">
                  Login
              </Button>
          </Grid>
      </Grid>
  );
};

export default AnonymousMenu;