import React, { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './scenes/landing-page';
import AccountPage from './scenes/account';
import ValidatorsPage from './scenes/validators';
import WalletPage from './scenes/wallet';
import { Keyring } from '@polkadot/api';
import NavBar from './scenes/nav-bar';
import { Router } from '@reach/router';
import { Grid } from '@material-ui/core';
import {
  getNetworkAvatarKusama,
  getNetworkAvatarPolkadot,
} from './utils/polka';
import kusamaLogo from './kusamaLogo.png';

import polkadotLogo from './polkadotLogo.png';

const stringToU8a = require('@polkadot/util/string/toU8a').default;

const generateRandomString = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

function App() {
  const [myAddress, setMyAddress] = useState(null);
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
  }, []);

  return (
    <React.Fragment>
      {network === null ? (
        <Grid container direction="column" justify="space-between">
          <Grid item xs={12}>
            <Grid container direction="row" justify="space-around">
              {' '}
              <Grid item xs={4}>
                {kusama && (
                  <div>
                    <img
                      alt="kusama"
                      onClick={() => setNetwork('kusama')}
                      src={`data:image/jpeg;base64,${kusama}`}
                    />
                    <img src={kusamaLogo} alt="Logo" />
                  </div>
                )}
              </Grid>
              <Grid item xs={4}>
                {polkadot && (
                  <div>
                    {' '}
                    <img
                      alt="polkadot"
                      onClick={() => setNetwork('polkadot')}
                      src={`data:image/jpeg;base64,${polkadot}`}
                    />
                    <img
                      src={polkadotLogo}
                      style={{ marginTop: '-80px', marginLeft: '-70px' }}
                      alt="kusamaImage"
                    />
                  </div>
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
            <LandingPage
              fae={network === 'kusama' ? kusama : polkadot}
              path="/"
              network={network}
            />
            <AccountPage path="account/:address" network={network} />
            <WalletPage address={myAddress} path="/wallet" network={network} />
            <ValidatorsPage path="validators" network={network} />
          </Router>
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
