import React, { useEffect, useState } from 'react';
import '../App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import ValidatorCard from '../components/ValidatorCard';
import { getImage } from '../utils/polka'

function AccountPage({ validators }) {
  const [account, setAccount] = useState(null);

  useEffect(async () => {
    const provider = new WsProvider('wss://kusama-rpc.polkadot.io/');
    const api = await ApiPromise.create({ provider: provider });

    console.log(api.derive)

    api.derive.chain.subscribeNewHeads(async (header) => {
      const account = {
        address: `${header.author}`
      }
      const details = await api.query.system.account(account.address);
      account.balance = `${details.data.free}`

      const image = await getImage(account.address, account.balance);
      account.image = image.data[account.address]

      setAccount(
        account
      )
    });
  }, []);

  return (
    <React.Fragment>
      <div className="App-header">
        <img
          src="http://i.picasion.com/gl/90/cQ2e.gif"
          width="479"
          height="64"
          border="0"
          alt="http://picasion.com/gl/cQ2e/"
        />
        <span>
          <ValidatorCard address={account && account.address} balance={account && account.balance} image={account && account.image}></ValidatorCard>
        </span>
      </div>
    </React.Fragment>
  );
}

export default AccountPage;
