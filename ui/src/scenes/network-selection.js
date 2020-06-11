import React, { useEffect, useState } from 'react';
import {
  getNetworkAvatarKusama,
  getNetworkAvatarPolkadot,
} from '../utils/polka';
import { Grid } from '@material-ui/core';
import { Hourglass } from 'react95';

const Networks = () => {
  const [kusama, setKusama] = useState(null);
  const [polkadot, setPolkadot] = useState(null);

  useEffect(() => {
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
  }, [getNetworkAvatarKusama, getNetworkAvatarPolkadot]);

  return (
    <Grid container>
      <Grid item>
        {kusama === null ? (
          <img src={`data:image/jpeg;base64,${kusama}`} />
        ) : (
          <Hourglass size={32} />
        )}
      </Grid>
      <Grid item>
        {polkadot && <img src={`data:image/jpeg;base64,${polkadot}`} />}
      </Grid>
    </Grid>
  );
};

export default Networks;
