import React, { useEffect, useState } from 'react';
import '../App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import ValidatorCard from '../components/ValidatorCard';
import axios from 'axios';
var config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

function AccountPage({ validators }) {
  const [balance, setBalance] = useState(0);
  const [images, setImages] = useState([]);

  const getImages = (data) => {
    axios({
      method: 'post',
      url: 'http://localhost:3141/kusama',
      data: data,
      config,
    })
      .then((r) => {
        const data = r.data;
        console.log(data);
        setImages(data);
      })
      .catch((e) => console.log(e));
  };

  /*   useEffect(() => {
    const validatorsShortList = validators.slice(0, 5);

    validatorsShortList.map(async (el) => {
      const data = {};
      data[el.address] = el.balance.slice(0, 2);
      await getImages(data);
    });
  }, []); */

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
          <ValidatorCard balance={balance}></ValidatorCard>
        </span>
      </div>
    </React.Fragment>
  );
}

export default AccountPage;
