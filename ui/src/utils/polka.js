import { ApiPromise, WsProvider } from '@polkadot/api';
import axios from 'axios';

var config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getImage = (address, balance) =>
  axios({
    method: 'post',
    url: 'http://localhost:3141/kusama',
    data: {
      [address]: balance,
    },
    config,
  });

export const getValidators = async () => {
  const provider = new WsProvider('wss://kusama-rpc.polkadot.io/');
  const api = await ApiPromise.create({ provider: provider });

  const validators = await api.query.session.validators();
  if (validators && validators.length > 0) {
    const validatorBalances = await Promise.all(
      validators.map((authorityId) => api.query.system.account(authorityId))
    );

    const validatorsList = validators.map((authorityId, index) => ({
      address: authorityId.toString(),
      balance: validatorBalances[index].data.free.toHuman(),
      nonce: validatorBalances[index].nonce.toHuman(),
    }));
    return validatorsList;
  }
};
