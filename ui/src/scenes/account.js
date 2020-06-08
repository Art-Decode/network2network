import React, { useEffect, useState } from 'react';
import '../App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import AccountCard from '../components/AccountCard';
import { Grid } from '@material-ui/core';
import axios from 'axios';
var config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

function AccountPage({ address }) {
  const [balance, setBalance] = useState(0);
  const [image, setImage] = useState(null);

  const getImage = () => {
    axios({
      method: 'post',
      url: 'http://localhost:3141/kusama',
      data: {
        [address]: balance,
      },
      config,
    })
      .then((r) => {
        const data = r.data;
        setImage(data[Object.keys(data)[0]]);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    const getApi = async () => {
      const provider = new WsProvider('wss://kusama-rpc.polkadot.io/');
      const api = await ApiPromise.create({ provider: provider });
      let {
        data: { free: previousFree },
      } = await api.query.system.account(address);
      setBalance(`${previousFree}`);
    };

    getApi();
    getImage();
  }, [address]);

  return (
    <div className="App-header">
      <span style={{ marginTop: '200px' }}>
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
