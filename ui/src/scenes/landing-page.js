import React, { useEffect, useState } from 'react';
import '../App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import {
  Table,
  TableHead,
  TableRow,
  WindowHeader,
  TableHeadCell,
  TableBody,
  Window,
  TableDataCell,
  WindowContent,
} from 'react95';

function LandingPage() {
  const [api, setApi] = useState(null);

  useEffect(() => {
    const getApi = async () => {
      const provider = new WsProvider('wss://kusama-rpc.polkadot.io/');
      const api = await ApiPromise.create({ provider: provider });
      setApi(api);

      const validators = await api.query.session.validators();
      if (validators && validators.length > 0) {
        const validatorBalances = await Promise.all(
          validators.map((authorityId) => api.query.system.account(authorityId))
        );
        console.log(
          'validators',
          validators.map((authorityId, index) => ({
            address: authorityId.toString(),
            balance: validatorBalances[index].data.free.toHuman(),
            nonce: validatorBalances[index].nonce.toHuman(),
          }))
        );
      }
      console.log(validators[0][0]);
    };

    getApi();
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <Window>
          <WindowHeader>Last Transactions</WindowHeader>

          <WindowContent>
            <Table>
              <TableHead>
                <TableRow head>
                  <TableHeadCell>Type</TableHeadCell>

                  <TableHeadCell>From</TableHeadCell>
                  <TableHeadCell>To</TableHeadCell>

                  <TableHeadCell>Value</TableHeadCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableDataCell style={{ textAlign: 'center' }}>
                    🌿
                  </TableDataCell>

                  <TableDataCell>Bulbasaur</TableDataCell>
                  <TableDataCell>Bulbasaur</TableDataCell>

                  <TableDataCell>64</TableDataCell>
                </TableRow>

                <TableRow>
                  <TableDataCell style={{ textAlign: 'center' }}>
                    🔥
                  </TableDataCell>

                  <TableDataCell>Charizard</TableDataCell>
                  <TableDataCell>Charizard</TableDataCell>

                  <TableDataCell>209</TableDataCell>
                </TableRow>

                <TableRow>
                  <TableDataCell style={{ textAlign: 'center' }}>
                    ⚡
                  </TableDataCell>

                  <TableDataCell>Pikachu</TableDataCell>
                  <TableDataCell>Pikachu</TableDataCell>

                  <TableDataCell>82</TableDataCell>
                </TableRow>
              </TableBody>
            </Table>
          </WindowContent>
        </Window>{' '}
      </div>
    </div>
  );
}

export default LandingPage;
