import React, { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './scenes/landing-page';
import AccountPage from './scenes/account';
import ValidatorsPage from './scenes/validators';
import { Keyring } from '@polkadot/api';
import NavBar from './scenes/nav-bar';
import { Router } from '@reach/router';
import axios from 'axios';
import { getValidators } from './utils/polka';

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

    getImage();
  }, []);

  return (
    <div className="App">
      <NavBar myAddress={myAddress} image={image}></NavBar>
      <Router>
        <LandingPage path="/" />
        <AccountPage path="account/:address" />
        <ValidatorsPage validators={[]} path="validators" />
      </Router>
    </div>
  );
}

export default App;
