import React, { useEffect, useState } from 'react';
import '../App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import WalletCard from '../components/WalletCard';
import { Grid } from '@material-ui/core';
import { getImage } from '../utils/polka';

function WalletPage({ address, network }) {
  const [balance, setBalance] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const getApi = async () => {
      const provider = new WsProvider(
        network === 'kusama'
          ? 'wss://cc3-5.kusama.network/'
          : 'wss://cc1-1.polkadot.network'
      );
      const api = await ApiPromise.create({ provider: provider });
      try {
        let {
          data: { free: previousFree },
        } = await api.query.system.account(address);
        setBalance(`${previousFree}`);
      } catch {
        console.log('e');
      }
    };

    getApi();
    getImage(address, balance, network)
      .then((r) => {
        const data = r.data;
        setImage(data[Object.keys(data)[0]]);
      })
      .catch((e) => console.log(e));
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
            <WalletCard
              image={image}
              address={address}
              balance={balance}
            ></WalletCard>
          </Grid>
        </Grid>
      </span>
    </div>
  );
}

export default WalletPage;
