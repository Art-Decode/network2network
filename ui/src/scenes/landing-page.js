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

  useEffect(() => {}, []);

  return (
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
  );
}

export default LandingPage;
