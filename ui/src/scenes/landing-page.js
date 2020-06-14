import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
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
import { Link } from '@reach/router';

function LandingPage({ face, network }) {
  const [lastTransfers, setLastTransfers] = useState(null);

  const getLastTransfert = async () => {
    const lastTransfersResp = await axios.get(
      `https://api-01.polkascan.io/${network}/api/v1/balances/transfer`
    );
    const lastTransfersData = lastTransfersResp.data.data;
    const lastTransfers = lastTransfersData.slice(0, 10).map((item) => {
      return {
        from: {
          address: item.attributes.sender.attributes.address,
          balance: item.attributes.sender.attributes.balance_total,
        },
        to: item.attributes.destination.attributes.address,
        amount: item.attributes.value,
      };
    });

    const reqBody = await lastTransfers.reduce(function (obj, transfer) {
      obj[transfer.from.address] = transfer.from.balance;
      return obj;
    }, {});
    const imagesResp = await axios.post(
      `/api/${network}`,
      reqBody
    );
    const imagesData = imagesResp.data;

    for (let [address, image] of Object.entries(imagesData)) {
      for (var index in lastTransfers) {
        if (lastTransfers[index].from.address === address) {
          lastTransfers[index].from.image = image;
        }
      }
    }

    setLastTransfers(lastTransfers);
  };

  useEffect(() => {
    getLastTransfert();
  });

  return (
    <div className="App-header">
      <Window>
        <WindowHeader>Last Transactions</WindowHeader>
        <WindowContent>
          {face && <img src={`data:image/jpeg;base64,${face}`} alt="face" />}

          <Table>
            <TableHead>
              <TableRow head>
                <TableHeadCell>From Image</TableHeadCell>
                <TableHeadCell>From Address</TableHeadCell>
                <TableHeadCell>To</TableHeadCell>
                <TableHeadCell>Amount</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {lastTransfers &&
                lastTransfers.map((transfer, i) => {
                  return (
                    <TableRow key={i}>
                      <TableDataCell style={{ textAlign: 'center' }}>
                        {transfer.from.image && (
                          <img
                            alt="anime"
                            style={{ width: '75px', borderRadius: '50%' }}
                            src={`data:image/jpeg;base64,${transfer.from.image}`}
                          />
                        )}
                      </TableDataCell>

                      <TableDataCell style={{ fontWeight: 600 }}>
                        <Link
                          style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 'initial',
                            fontStyle: 'italic',
                          }}
                          to={`account/${transfer.from.address}`}
                        >
                          {transfer.from.address}
                        </Link>
                      </TableDataCell>
                      <TableDataCell style={{ fontStyle: 'italic' }}>
                        <Link
                          style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 'initial',
                            fontStyle: 'italic',
                          }}
                          to={`account/${transfer.to}`}
                        >
                          {transfer.to}
                        </Link>
                      </TableDataCell>
                      <TableDataCell>{transfer.amount}</TableDataCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </WindowContent>
      </Window>{' '}
    </div>
  );
}

export default LandingPage;
