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
  const [image, setImage] = useState('')

  useEffect(async() => {
    const image = await getImage(myAddress, 0, network);
    setImage(
      image.data[myAddress]
    )
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
          <Grid item item>
            <Button
              style={{ fontWeight: 'bold' }}
              onClick={() => setOpen(!open)}
            >
              👾 Start
            </Button>
            {open && (
              <List horizontalAlign="left" verticalAlign="bottom">
                <Link to={`/`} style={{ textDecoration: 'none' }}>
                  <ListItem onClick={() => setOpen(!open)}>👨‍💻 Home</ListItem>
                </Link>

                <Link to={`wallet`} style={{ textDecoration: 'none' }}>
                  <ListItem onClick={() => setOpen(!open)}>
                    📁 My wallet
                  </ListItem>
                </Link>
                <Link to={`/`} style={{ textDecoration: 'none' }}>
                  <ListItem onClick={() => changeNetwork(null)}>
                    🌐 Change Network
                  </ListItem>
                </Link>

                <Link to={`validators`} style={{ textDecoration: 'none' }}>
                  <ListItem onClick={() => setOpen(!open)}>
                    💂‍♂️ Validators
                  </ListItem>
                </Link>

                <Divider />

                <ListItem disabled>🔙 Logout</ListItem>
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
              <Button square>🔍</Button>
            </Link>{' '}
          </Grid>
        </Grid>
        {image ? (
          <>
            <Link style={{ textDecoration: 'none' }} to={`wallet`}>
              {truncate(myAddress)}
            </Link>
            <Link style={{ textDecoration: 'none' }} to={`wallet`}>
              <Avatar style={{ width: '36px', height: '36px' }}>
                <img style={{ width: '36px' }} src={`data:image/jpeg;base64,${image}`} />{' '}
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
