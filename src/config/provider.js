import { NODE, NETWORK_ID } from './config';
import secrets from './secrets';
import { version } from '../../package.json';

export default {
  api: {
    ipfs: 'https://ipfs.blockfrost.dev/ipfs',
    base: (node = NODE.mainnet) => node,
    header: { [secrets.NAMI_HEADER || 'dummy']: version },
    key: (network = 'mainnet') => ({
      project_id:
        network === NETWORK_ID.mainnet
          ? 'testnetfv0PpRvYAZOHMyBMhU1PiWM5O1Z8D8yp'
          : 'testnetfv0PpRvYAZOHMyBMhU1PiWM5O1Z8D8yp',
    }),
    price: (currency = 'usd') =>
      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=${currency}`
      )
        .then((res) => res.json())
        .then((res) => res.cardano[currency]),
  },
};
