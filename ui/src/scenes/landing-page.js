import React, { useEffect, useState } from 'react';
import '../App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { getImage } from '../utils/polka';
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
import Tone from 'tone';

var synth = new Tone.PolySynth(6, Tone.Synth, {
  oscillator: {
    frequency: 'C4',
    detune: 0,
    oscillator: {
      type: 'square',
    },
    filter: {
      Q: 6,
      type: 'lowpass',
      rolloff: -24,
    },
    envelope: {
      attack: 1,
      decay: 0.1,
      sustain: 0.9,
      release: 2,
    },
    filterEnvelope: {
      attack: 2,
      decay: 0.2,
      sustain: 0.5,
      release: 1,
      baseFrequency: 60,
      octaves: 7,
      exponent: 2,
    },
  },
}).toMaster();

const notes = ['C4', 'F4', 'B4', 'D5', 'G5', 'Bb5'];
function LandingPage({network}) {
  const [kusamaFace, setKusamaFace] = useState(null);
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
    console.log(reqBody);
    const imagesResp = await axios.post(`/api/${network}`, reqBody);
    const imagesData = imagesResp.data;
    console.log(imagesData);

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
  }, [getLastTransfert]);

  return (
    <div className="App-header">
      <Window>
        <WindowHeader>Last Transactions</WindowHeader>
        <WindowContent>
          {kusamaFace && <img src={`data:image/jpeg;base64,${kusamaFace}`} />}

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
                lastTransfers.map((transfer) => {
                  return (
                    <TableRow>
                      <TableDataCell style={{ textAlign: 'center' }}>
                        {transfer.from.image && (
                          <img
                            style={{ width: '75px', borderRadius: '50%' }}
                            src={`data:image/jpeg;base64,${transfer.from.image}`}
                          />
                        )}
                      </TableDataCell>

                      <TableDataCell style={{ fontWeight: 600 }}>
                        {transfer.from.address}
                      </TableDataCell>
                      <TableDataCell style={{ fontStyle: 'italic' }}>
                        {transfer.to}
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
