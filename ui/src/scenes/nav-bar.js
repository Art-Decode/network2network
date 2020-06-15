import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  Avatar,
  Hourglass,
  List,
  ListItem,
  Divider,
} from 'react95';
import Grid from '@material-ui/core/Grid';
import { Link } from '@reach/router';
import { getImage } from '../utils/polka';

function NavBar({ myAddress, network, changeNetwork }) {
  const [account, setAccount] = useState('');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState('');

  const getAndSetImage = async () => {
    const image = await getImage(myAddress, 0, network);
    setImage(image.data[myAddress]);
  };

  useEffect(() => {
    getAndSetImage();
  }, []);

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
            <Button
              style={{ fontWeight: 'bold' }}
              onClick={() => setOpen(!open)}
            >
              <span role="img" aria-label="start">
                👾 Start
              </span>
            </Button>
            {open && (
              <List horizontalAlign="left" verticalAlign="bottom">
                <Link to={`/`} style={{ textDecoration: 'none' }}>
                  <ListItem onClick={() => setOpen(!open)}>
                    <span role="img" aria-label="home">
                      {' '}
                      👨‍💻 Home
                    </span>
                  </ListItem>
                </Link>

                <Link to={`wallet`} style={{ textDecoration: 'none' }}>
                  <ListItem onClick={() => setOpen(!open)}>
                    <span role="img" aria-label="wallet">
                      {' '}
                      📁 My wallet
                    </span>
                  </ListItem>
                </Link>
                <Link to={`/`} style={{ textDecoration: 'none' }}>
                  <ListItem onClick={() => changeNetwork(null)}>
                    <span role="img" aria-label="change-newtork">
                      🌐 Change Network
                    </span>
                  </ListItem>
                </Link>

                <Link to={`validators`} style={{ textDecoration: 'none' }}>
                  <ListItem onClick={() => setOpen(!open)}>
                    <span role="img" aria-label="validators">
                      {' '}
                      💂‍♂️ Validators
                    </span>
                  </ListItem>
                </Link>

                <Divider />

                <ListItem disabled>
                  <span role="img" aria-label="logout">
                    {' '}
                    🔙 Logout{' '}
                  </span>
                </ListItem>
              </List>
            )}
          </Grid>
          <Grid item xs={6}></Grid>{' '}
          <Grid item>
            <TextField
              onChange={handleChange}
              placeholder="Address..."
              width={250}
              style={{ marginLeft: -200 }}
            />
          </Grid>
          <Grid item>
            <Link to={`account/${account}`}>
              <Button square>
                <span role="img" aria-label="search">
                  🔍
                </span>
              </Button>
            </Link>
          </Grid>
        </Grid>
        {image ? (
          <>
            <Link style={{ textDecoration: 'none' }} to={`wallet`}>
              {truncate(myAddress)}
            </Link>
            <Link style={{ textDecoration: 'none' }} to={`wallet`}>
              <Avatar style={{ width: '36px', height: '36px' }}>
                <img
                  alt="anime"
                  style={{ width: '36px' }}
                  src={`data:image/jpeg;base64,${image}`}
                />{' '}
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
