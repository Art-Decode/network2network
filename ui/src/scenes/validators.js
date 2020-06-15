import React, { useEffect, useState } from 'react';
import '../App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import ValidatorCard from '../components/ValidatorCard';
import { getImage } from '../utils/polka';
function ValidatorPage({ network }) {
  const [account, setAccount] = useState(null);
  const networkUrl =
    network === 'kusama'
      ? 'wss://kusama-rpc.polkadot.io/'
      : 'wss://cc1-1.polkadot.network';

  const wsProvider = new WsProvider(networkUrl);
  const subscribeLastAuthor = async () => {
    const api = await ApiPromise.create({ provider: wsProvider });
    const sub = await api.derive.chain.subscribeNewHeads(async (header) => {
      const account = {
        address: `${header.author}`,
      };
      const details = await api.query.system.account(account.address);
      account.balance = `${details.data.free}`;
      const image = await getImage(account.address, account.balance, network);
      account.image = image.data[account.address];
      setAccount(account);
    });
  };

  useEffect(() => {
    subscribeLastAuthor();
    return () => wsProvider.disconnect();
  }, []);

  return (
    <React.Fragment>
      <div className="App-header">
        <br />

        <img
          src="http://i.picasion.com/gl/90/cRJs.gif"
          width="509"
          height="60"
          border="0"
          alt="logo"
        />
        <br />
        <span>
          <ValidatorCard
            address={account && account.address}
            balance={account && account.balance}
            image={account && account.image}
          ></ValidatorCard>
        </span>
      </div>
    </React.Fragment>
  );
}

export default ValidatorPage;
