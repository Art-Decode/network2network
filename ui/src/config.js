const env = 'demo';

export const getConfig = () => {
  if (env === 'demo') return '/api/';
  return 'http://localhost:3141/';
};
