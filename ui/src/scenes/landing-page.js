import React, { useEffect, useState } from 'react';
import '../App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { getImage } from '../utils/polka';
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
function LandingPage() {
  const [kusamaFace, setKusamaFace] = useState(null);

  useEffect(() => {
    const getGenesishash = async () => {
      const provider = new WsProvider('wss://kusama-rpc.polkadot.io/');
      const api = await ApiPromise.create({ provider: provider });
      const unsub = await api.query.timestamp.now((moment) => {
        synth.set('detune', -1200);
        //play a chord
        synth.triggerAttackRelease(['C4', 'E4', 'A4'], '4n');
        console.log(`The last block has a timestamp of ${moment}`);
      });
      return api.genesisHash.toHex();
    };

    getGenesishash().then((genesisHash) => {
      console.log(genesisHash);
      getImage('KszLJ4soPWsj9SqohCEALSM3LK4ZYcrhFb7K8GZqf3WYgmZ', 0)
        .then((r) => {
          const data = r.data;
          setKusamaFace(data[Object.keys(data)[0]]);
        })
        .catch((e) => console.log(e));
    });
  }, []);

  return (
    <div className="App-header">
      <Window>
        <WindowHeader>Last Transactions</WindowHeader>
        <WindowContent>
          {kusamaFace && <img src={`data:image/jpeg;base64,${kusamaFace}`} />}

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
