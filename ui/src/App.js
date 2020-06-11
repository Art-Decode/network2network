import React, { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './scenes/landing-page';
import AccountPage from './scenes/account';
import ValidatorsPage from './scenes/validators';
import WalletPage from './scenes/wallet';
import { Keyring } from '@polkadot/api';
import NavBar from './scenes/nav-bar';
import { Router } from '@reach/router';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import { getValidators } from './utils/polka';
import Typography from '@material-ui/core/Typography';
import { Link } from '@reach/router';
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
  const [network, setNetwork] = useState(null);
  const [kusama, setKusama] = useState(null);
  const [polkadot, setPolkadot] = useState(null);

  const changeNetwork = (network) => {
    setNetwork(network);
  };

  useEffect(() => {
    const ALICE_SEED = generateRandomString().padEnd(32, ' ');
    const keyring = new Keyring();
    const pairAlice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
    const address = `${keyring.getPair(pairAlice.address).address}`;
    setMyAddress(address);

    const getImage = (network) => {
      axios({
        method: 'post',
        url: `/api/${network}`,
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
    getImage(network);
  }, []);

  return (
    <React.Fragment>
      {network === null ? (
        <Grid container direction="column" justify="space-between">
          {' '}
          <Grid style={{ margin: 'auto', marginBottom: '100px' }} item xs={12}>
            <h1>CHOOSE YOUR NETWORK </h1>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row" justify="space-around">
              {' '}
              <Grid item xs={4}>
                {kusama && (
                  <img
                    onClick={() => setNetwork('kusama')}
                    src={`data:image/jpeg;base64,${kusama}`}
                  />
                )}
              </Grid>
              <Grid item xs={4}>
                {polkadot && (
                  <img
                    onClick={() => setNetwork('polkadot')}
                    src={`data:image/jpeg;base64,${polkadot}`}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <div className="App">
          <NavBar
            changeNetwork={changeNetwork}
            network={network}
            myAddress={myAddress}
          ></NavBar>
          <Router>
            <LandingPage path="/" network={network} />
            <AccountPage path="account/:address" network={network} />
            <WalletPage address={myAddress} path="/wallet" network={network} />
            <ValidatorsPage validators={[]} path="validators" network={network} />
          </Router>
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
