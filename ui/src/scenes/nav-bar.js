import React, { useState } from 'react';
import '../App.css';
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  Avatar,
  Hourglass,
  LogoIcon,
} from 'react95';
import Grid from '@material-ui/core/Grid';
import { Link } from '@reach/router';

function NavBar({ myAddress, image }) {
  const [account, setAccount] = useState('');

  const handleChange = (e) => setAccount(e.target.value);
  const truncate = (str) => {
    return str.substr(0, 4) + '... ';
  };
  return (
    <AppBar>
      <Toolbar>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Button style={{ fontWeight: 'bold' }}>👾 Start</Button>
          </Grid>
          <Grid item></Grid>
          <Grid item>
            <TextField
              onChange={handleChange}
              placeholder="Address..."
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
        {image ? (
          <>
            <Link to={`account/${myAddress}`}>{truncate(myAddress)}</Link>
            <Link to={`account/${myAddress}`}>
              <Avatar>
                <img src={`data:image/jpeg;base64,${image}`} />{' '}
              </Avatar>
            </Link>
          </>
        ) : (
          <Hourglass size={32} />
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
