import React, { useState } from 'react';
import '../App.css';
import { AppBar, Toolbar, Button, TextField, Avatar, Hourglass } from 'react95';
import rei from '../rei.jpg'; // Tell webpack this JS file uses this image
import Grid from '@material-ui/core/Grid';
import { Link } from '@reach/router';

function NavBar({ myAddress }) {
  const [account, setAccount] = useState('');

  const handleChange = (e) => setAccount(e.target.value);

  return (
    <AppBar>
      <Toolbar>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid container>
            <Grid item>
              <TextField
                onChange={handleChange}
                placeholder="Search..."
                width={150}
                style={{ marginLeft: 4 }}
              />
            </Grid>
            <Grid item>
              <Link to={`account/${account}`}>
                <Button square>🔍</Button>
              </Link>{' '}
            </Grid>
          </Grid>
        </Grid>
        {myAddress ? (
          <Avatar>
            <img src={rei} alt="Logo" />{' '}
          </Avatar>
        ) : (
          <Hourglass size={32} />
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
