import { ApiPromise, WsProvider } from '@polkadot/api';
import axios from 'axios';
import { getConfig } from '../config';

var config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getImage = (address, balance, network) =>
  axios({
    method: 'post',
    url: `${getConfig()}${network}`,
    data: {
      [address]: balance,
    },
    config,
  });

export const getImageKusama = (address, balance) =>
  axios({
    method: 'post',
    url: 'polkadot',
    data: {
      [address]: balance,
    },
    config,
  });

export const getNetworkAvatarKusama = () =>
  axios({
    method: 'get',
    url: `${getConfig()}kusama/avatar/2703324`,
    config,
  });

export const getNetworkAvatarPolkadot = () =>
  axios({
    method: 'get',
    url: `${getConfig()}polkadot/avatar/200000`,
    config,
  });

export const getValidators = async () => {
  const provider = new WsProvider('wss://cc3-5.kusama.network/');
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
