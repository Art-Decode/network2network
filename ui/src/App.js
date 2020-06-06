import React, { useEffect, useState } from 'react';
import './App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';

function App() {
  const [api, setApi] = useState(null);

  useEffect(() => {
    const getApi = async () => {
      const provider = new WsProvider('wss://kusama-rpc.polkadot.io/');
      const api = await ApiPromise.create({ provider: provider });
      setApi(api);
    };

    getApi();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{api && api.genesisHash.toHex()}</p>
      </header>
    </div>
  );
}

export default App;
