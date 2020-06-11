import React, { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './scenes/landing-page';
import AccountPage from './scenes/account';
import ValidatorsPage from './scenes/validators';
import WalletPage from './scenes/wallet';
import NetworkPage from './scenes/network-selection';
import { Keyring } from '@polkadot/api';
import NavBar from './scenes/nav-bar';
import { Router } from '@reach/router';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import { getValidators } from './utils/polka';
import Typography from '@material-ui/core/Typography';
import {
  getNetworkAvatarKusama,
  getNetworkAvatarPolkadot,
  getImage,
} from './utils/polka';

const stringToU8a = require('@polkadot/util/string/toU8a').default;

const generateRandomString = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

var config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

function App() {
  const [myAddress, setMyAddress] = useState(null);
  const [image, setImage] = useState(null);
  const [network, setnetwork] = useState(null);
  const [kusama, setKusama] = useState(null);
  const [polkadot, setPolkadot] = useState(null);

  useEffect(() => {
    const ALICE_SEED = generateRandomString().padEnd(32, ' ');
    const keyring = new Keyring();
    const pairAlice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
    const address = `${keyring.getPair(pairAlice.address).address}`;
    setMyAddress(address);

    const getImage = () => {
      axios({
        method: 'post',
        url: 'http://localhost:3141/kusama',
        data: {
          [address]: 0,
        },
        config,
      })
        .then((r) => {
          const data = r.data;
          setImage(data[Object.keys(data)[0]]);
        })
        .catch((e) => console.log(e));
    };
    getNetworkAvatarKusama()
      .then((r) => {
        const data = r.data;
        setKusama(data[Object.keys(data)[0]]);
      })
      .catch((e) => console.log(e));

    getNetworkAvatarPolkadot()
      .then((r) => {
        const data = r.data;
        setPolkadot(data[Object.keys(data)[0]]);
      })
      .catch((e) => console.log(e));
    getImage();
  }, []);

  return (
    <React.Fragment>
      {network === null ? (
        <Grid
          container
          direction="column-reverse"
          justify="space-between"
          alignItems="center"
        >
          {' '}
          <Grid item xs={12}>
            <h1>CHOOSE YOUR NETWORK </h1>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
            >
              {' '}
              <Grid item xs={6}>
                {kusama && <img src={`data:image/jpeg;base64,${kusama}`} />}
              </Grid>
              <Grid item xs={6}>
                {polkadot && (
                  <img
                    style={{ width: '509px' }}
                    src={`data:image/jpeg;base64,${polkadot}`}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <div className="App">
          <NavBar myAddress={myAddress} image={image}></NavBar>
          <Router>
            <LandingPage path="/" />
            <AccountPage path="account/:address" />
            <WalletPage address={myAddress} path="/wallet" />
            <ValidatorsPage validators={[]} path="validators" />
            <NetworkPage path="networks" />
          </Router>
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
