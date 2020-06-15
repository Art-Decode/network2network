import React, { useEffect, useState } from 'react';
import '../App.css';
import AccountCard from '../components/AccountCard';
import { Grid } from '@material-ui/core';
import { getImage } from '../utils/polka';
const { ApiPromise, WsProvider } = require('@polkadot/api');

function AccountPage({ address, network }) {
  const [balance, setBalance] = useState(0);
  const [image, setImage] = useState(null);

  const getApi = async () => {
    const networkUrl =
      network === 'kusama'
        ? 'wss://kusama-rpc.polkadot.io/'
        : 'wss://cc1-1.polkadot.network';

    const wsProvider = new WsProvider(networkUrl);

    const api = await ApiPromise.create({ provider: wsProvider });

    let {
      data: { free: previousFree },
    } = await api.query.system.account(address);
    setBalance(`${previousFree}`);
    getImage(address, `${previousFree}`, network)
      .then((r) => {
        const data = r.data;
        setImage(data[Object.keys(data)[0]]);
      })
      .catch((e) => console.log('errore', e));
  };

  useEffect(() => {
    getApi();
  }, []);

  return (
    <div className="App-header">
      <span style={{ marginTop: '170px' }}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item>
            <AccountCard
              image={image}
              address={address}
              balance={balance}
            ></AccountCard>
          </Grid>
        </Grid>
      </span>
    </div>
  );
}

export default AccountPage;
